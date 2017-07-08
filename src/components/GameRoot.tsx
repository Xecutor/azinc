import * as React from "react";
import { ModalDialog, ModalContainer } from 'react-modal-dialog';
import ReactTooltip = require('react-tooltip');
import { Options, OptionsComponent } from './Options';
import { AscensionComponent, Upgrades } from './Ascension';
import { TranscendComponent } from './Transcend';
import { MiniButton } from './MiniButton'

import { MainGame, LetterRecord, maxLettersCount } from "./MainGame";

interface GameRootState {
    letters: Array<LetterRecord>;
    optionsOpened: boolean;
    ascension: boolean;
    options: Options;
    upgrades: Upgrades;
    stage: number;
}

function getKeys<T>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
}

const suffixRanges: { [idx: string]: number[] } = {
    AE: [1, 5],
    FJ: [6, 10],
    KO: [11, 15],
    PT: [16, 20],
    UZ: [21, 26]
};

const upgradeSuffixes = [
    'AE', 'FJ', 'KO', 'PT', 'UZ'
];

function upgradeSuffixToRange(upgradeName: string) {
    const suffix = upgradeName.substr(upgradeName.length - 2);
    let rv = suffixRanges[suffix];
    return rv || [0, 0];
}

function indexToUpgradeSuffix(idx: number) {
    return upgradeSuffixes[Math.floor((idx - 1) / 5)];
}

export class GameRoot extends React.Component<undefined, GameRootState> {

    timerId: number;
    lastUpdate: number;
    lastSave: number;

    tooltip: ReactTooltip;

    multipliers = new Array<number>(maxLettersCount);

    constructor() {
        super();
        this.state = {
            letters: [new LetterRecord()],
            optionsOpened: false,
            ascension: false,
            options: new Options(),
            upgrades: new Upgrades(),
            stage: 1

        };
        this.timerId = setInterval(() => this.onTimer(), 1000);
        this.lastUpdate = performance.now();
        this.lastSave = this.lastUpdate;
        this.load();
        window.onunload = () => this.save();
    }

    save() {
        if (localStorage) {
            let saveData = JSON.stringify(this.state);
            localStorage.setItem("azincsave", saveData);
        }
    }

    updateMultipliers(u: Upgrades) {
        for (let i = 0; i < this.multipliers.length; ++i)this.multipliers[i] = 1;
        for (let k of getKeys(u)) {
            if (u[k] && k.substr(0, 4) == "mult") {
                let r = upgradeSuffixToRange(k);
                if (r) {
                    for (let i = r[0]; i <= r[1]; ++i) {
                        this.multipliers[i] = u.globalMult ? 4 : 2;
                    }
                }
            }
        }
    }

    load() {
        let savedData = localStorage && localStorage.getItem("azincsave");
        if (savedData) {
            let parsedData = JSON.parse(savedData);
            if (parsedData) {
                this.state = parsedData;
            }
        }
        this.updateMultipliers(this.state.upgrades);
        this.updateChange(this.state.letters);
    }

    calcInc(letters: Array<LetterRecord>, idx: number, checkOverflow = true): Array<number> {
        let l = letters[idx];
        if (!l || l.paused) return [0, 0];
        let lp = letters[idx - 1];
        let cnt = Math.abs((lp.count / 10));
        if (!checkOverflow || idx == 1 || cnt > l.level) cnt = l.level;
        let mul = letters.length - idx - 2;
        if (mul > 15) {
            mul = 10 + Math.floor((mul - 15) / 4);
        } else if (mul > 5) {

            mul = 5 + Math.floor((mul - 5) / 2);
        }
        if (mul < 1) {
            mul = 1;
        }
        mul *= this.multipliers[idx];
        return [cnt, mul];
    }

    updateChange(newLetters: Array<LetterRecord>) {
        for (let i = 1; i < newLetters.length; ++i) {
            let [cnt, mul] = this.calcInc(newLetters, i, false);
            let [cnt2] = this.calcInc(newLetters, i + 1, false);
            newLetters[i].change = cnt * mul - cnt2 * 10;
        }
    }

    checkForLastAutoClick(letters: LetterRecord[]) {
        if (!this.state.upgrades.autoGetLast) {
            return;
        }
        let l = letters;
        let ll = l.length;
        if (l[ll - 1].paused) {
            return;
        }
        if (ll <= 2 || l[ll - 2].count >= 10) {
            this.onLetterClick(ll - 1, letters);
        }
    }

    onTimer() {
        let now = performance.now();
        let newLetters = this.state.letters.slice();
        let updated = false;
        while (now - this.lastUpdate >= 1000) {
            for (let i = 1; i < newLetters.length; ++i) {
                const upgradeSuffix = indexToUpgradeSuffix(i);
                const autoUpgradeName = ("autoUpgrade" + upgradeSuffix) as keyof Upgrades;
                if (this.state.upgrades[autoUpgradeName]) {
                    if (this.onUpgradeClick(i, -1, 10, newLetters)) {
                        updated = true;
                    }
                }
                let l = newLetters[i];
                let lp = newLetters[i - 1];
                if (l.paused) {
                    continue;
                }
                if (i == 1 || lp.count >= 10) {
                    let [cnt, mul] = this.calcInc(newLetters, i)
                    l.count += (cnt * mul);
                    lp.count -= cnt * 10;
                    l.count = Math.round(l.count);
                    updated = true;
                }
                this.checkForLastAutoClick(newLetters);
            }
            this.lastUpdate += 1000;
            if (newLetters.length == 1) {
                this.checkForLastAutoClick(newLetters);
            }
        }

        if (updated) {
            this.updateChange(newLetters);
            this.setState({ letters: newLetters });
        }
        if (now - this.lastSave > 10) {
            this.save();
            this.lastSave = now;
        }
    }

    componentDidUpdate(prevProps: any, prevState: GameRootState) {
        if (this.state.letters.length != prevState.letters.length) {
            ReactTooltip.rebuild();
        }
        if (this.tooltip.state.show) {
            let tgt = this.tooltip.state.currentTarget;
            let tip = tgt.getAttribute('data-tip');
            if (tgt.getAttribute('data-multiline')) {
                tip = tip.split('<br>').map((txt: string, idx: number) => <span className='multi-line' key={idx}>{txt}</span>);
            }
            this.tooltip.setState({
                placeholder: tip
            });
        }
    }


    onLetterClick(idx: number, letters?: LetterRecord[]) {
        const needSetState = letters === undefined;
        letters = letters ? letters : this.state.letters.slice();
        let prevCount = idx < 2 ? 10 : letters[idx - 1].count;
        if (this.state.letters.length == 1) {
            this.setState({ letters: [...letters, new LetterRecord()] });
        }
        if (idx > 0 && prevCount >= 10) {
            let newLetters = letters;
            newLetters[idx].count += this.multipliers[idx];
            if (idx > 1) newLetters[idx - 1].count -= 10;
            if (idx == newLetters.length - 1 && newLetters[idx].count >= 10 && newLetters.length < maxLettersCount) {
                newLetters.push(new LetterRecord());
            }
            if (needSetState) {
                this.setState({ letters: newLetters });
            }
        }
    }

    onUpgradeClick(idx: number, count: number, minChange: number, letters?: LetterRecord[]) {
        const needSetState = letters === undefined;
        letters = letters ? letters : this.state.letters.slice();
        if (idx == letters.length - 1) {
            return;
        }
        let newLetters = letters;
        let updated = false;
        let curChange = newLetters[idx - 1].change;
        let positiveChangeOnUpgrade = curChange >= 0;
        if (!needSetState) {
            positiveChangeOnUpgrade = true;
        }
        const upgradeSiffix = indexToUpgradeSuffix(idx);
        const convUpgradeName = ('convPurchase' + upgradeSiffix) as keyof Upgrades;
        const autoUpgradeName = ('autoUpgrade' + upgradeSiffix) as keyof Upgrades;
        const haveConvUpgrade = this.state.upgrades[convUpgradeName];
        const haveAutoUpgrade = this.state.upgrades[autoUpgradeName];
        do {

            let ucost = newLetters[idx].level + 1;
            let cvtUpgrade = haveConvUpgrade && ((ucost * 10 / this.multipliers[idx + 1]) < newLetters[idx].count);
            if (!cvtUpgrade && ucost > newLetters[idx + 1].count) {
                break;
            }
            if (idx > 1 && count < 0 && positiveChangeOnUpgrade && curChange <= minChange) {
                break;
            }

            if (!cvtUpgrade && haveConvUpgrade && haveAutoUpgrade && letters[idx].change > letters[idx + 1].change) {
                break;
            }

            newLetters[idx].level++;

            if (cvtUpgrade) {
                newLetters[idx].count -= ucost * 10 / this.multipliers[idx + 1];
            }
            else {
                newLetters[idx + 1].count -= ucost;
            }
            curChange -= 10;
            updated = true;
        } while (count < 0 || (--count) != 0);
        if (updated && needSetState) {
            this.updateChange(newLetters);
            this.setState({ letters: newLetters });
        }
        return updated;
    }

    onPauseClick(idx: number) {
        let newLetters = this.state.letters.slice();
        newLetters[idx].paused = !newLetters[idx].paused;
        this.updateChange(newLetters);
        this.setState({ letters: newLetters });
    }

    onOptionsClick() {
        this.setState({ optionsOpened: true });
    }

    onOptionsClose() {
        this.setState({ optionsOpened: false });
    }

    updateOptionsDiv(d: HTMLElement) {
        if (d) {
            d.style.color = '#000001';
            setTimeout(function () {
                d.style.color = '#000000';
            }, 500);
        }
    }

    onOptionsUpdate(updatedOptions: Options) {
        this.setState({ options: updatedOptions });
        if (this.state.options.showTooltips != updatedOptions.showTooltips) {
            ReactTooltip.rebuild();
        }
    }

    resetState(upgrades: Upgrades) {
        this.setState({ upgrades: upgrades, ascension: false, stage: 1, letters: [new LetterRecord()] });
        this.updateMultipliers(upgrades);
    }

    onHardReset() {
        this.setState({ optionsOpened: false });
        this.resetState(new Upgrades());
    }

    onAscendClick() {
        this.setState({ ascension: true });
    }

    onBuyUpgrade(key: keyof Upgrades) {
        let newUpgrades = { ...this.state.upgrades };
        newUpgrades[key] = true;
        this.resetState(newUpgrades);
    }

    onTranscendClick() {
        this.setState({ stage: this.state.stage + 1, ascension: false });
    }

    render() {
        let mainComponent: JSX.Element;

        if (this.state.stage > 1) {
            mainComponent = <TranscendComponent />;
        }
        else {
            if (this.state.ascension) {
                mainComponent =
                    <AscensionComponent
                        upgrades={this.state.upgrades}
                        onBuyUpgrade={(key: keyof Upgrades) => this.onBuyUpgrade(key)}
                        onTranscendClick={() => this.onTranscendClick()}
                    />;
            }
            else {
                mainComponent =
                    <MainGame
                        letters={this.state.letters}
                        options={this.state.options}
                        onLetterClick={(idx) => this.onLetterClick(idx)}
                        onUpgradeClick={(idx, max, min) => this.onUpgradeClick(idx, max, min)}
                        onPauseClick={(idx) => this.onPauseClick(idx)}
                        onAscendClick={() => this.onAscendClick()}
                    />

            }
        }

        return (
            <div>
                <MiniButton className="optionsButton" onClick={() => this.onOptionsClick()}>⚙</MiniButton>
                {
                    this.state.optionsOpened &&
                    <ModalContainer onClose={() => this.onOptionsClose()}>
                        <ModalDialog onClose={() => this.onOptionsClose()}>
                            <div ref={(d) => this.updateOptionsDiv(d)}>
                                <OptionsComponent
                                    options={this.state.options}
                                    onChange={(updatedOptions: Options) => this.onOptionsUpdate(updatedOptions)}
                                    onHardReset={() => this.onHardReset()}
                                />
                            </div>
                        </ModalDialog>
                    </ModalContainer>
                }
                <div className="container">{mainComponent}</div>
                <ReactTooltip
                    effect={'float'}
                    ref={(tt) => this.tooltip = tt}
                />
            </div>
        );
    }
}
