import * as React from "react";
import * as ReactDOM from 'react-dom';
import { LetterRecord } from './MainGame';
import { Options } from './Options';
import { format } from 'swarm-numberformat';
import ReactTooltip = require('react-tooltip');
import { MiniButton } from './MiniButton';
import {AltShiftState} from './GameRoot';
import {LetterOptions} from './LetterOptions';

interface LetterBoxProps {
    sym: string;
    idx: number;
    letter: LetterRecord;
    letterOptions: LetterOptions;

    altShiftState: AltShiftState;

    ascend?: boolean;

    options: Options;

    onClick: (idx: number) => void;
    onUpgradeClick: (idx: number, count: number, min: number) => void;
    onPauseClick: (idx: number) => void;
    onAscendClick: () => void;
    onLetterOptionsClick: (idx:number)=>void;
}

export class LetterBox extends React.Component<LetterBoxProps, undefined> {
    onUpgradeClick(e: React.MouseEvent<HTMLElement>) {
        this.props.onUpgradeClick(this.props.idx, e.altKey ? 100 : e.shiftKey ? 10 : 1, 10);
    }
    onMaxUpgradeClick(e: React.MouseEvent<HTMLElement>) {
        this.props.onUpgradeClick(this.props.idx, -1, e.altKey ? 1009 : e.shiftKey ? 109 : -1);
    }
    render() {
        if (this.props.idx == 0) {
            return (
                <div className="letterBoxDiv" onClick={() => this.props.onClick(this.props.idx)}>
                    <div className="letterDivInf">{this.props.sym}</div>
                    {
                        this.props.ascend &&
                        <MiniButton borderColor="red" onClick={this.props.onAscendClick}>
                            <span className="smallText">Ascend</span>
                        </MiniButton>
                    }
                </div>
            )
        }
        else {
            let pauseButtonSym = this.props.letter.paused ? '▶' : '∥';
            let fmt = this.props.options.numberFormat;
            let l = this.props.letter;
            let lc = format(l.change, { format: fmt, flavor: 'short' });
            let change = l.change > 0 ? '+' + lc : lc;
            let gen = format(l.generating, { format: fmt, flavor: 'short' });
            let spend = format(l.spending, { format: fmt, flavor: 'short' });
            let count = format(this.props.letter.count, { format: fmt, flavor: 'short' });
            let countRaw = this.props.letter.count.toString();
            let addStyle = this.props.letter.paused ? " letterBoxDivPaused" : "";

            let ttUpgradeOnce = {};
            let ttUpgradeMax = {};
            let ttCount = {};
            let ttPause = {};
            let ttChange = {};
            if (this.props.options.showTooltips) {
                let upgradeAmount = 1;
                if (this.props.altShiftState.shiftDown) {
                    upgradeAmount = 10;
                }
                else if (this.props.altShiftState.altDown) {
                    upgradeAmount = 100;
                }
                let upgradeCost = (this.props.letter.level * upgradeAmount);
                upgradeCost += ((upgradeAmount * (upgradeAmount + 1)) / 2);
                ttUpgradeOnce = {
                    "data-tip": `Buy ${upgradeAmount} autoconverter${upgradeAmount>1?'s':''} for ${upgradeCost==1?upgradeCost : upgradeCost.toString() + ' of'} next letter${upgradeCost>1?'s':''}<br>` +
                    "Hold shift and click to buy 10<br>" +
                    "Hold alt and click to buy 100<br>" +
                    `Each autoconverter will convert 10 of the previous letter to ${this.props.letter.mult} of this letter each second`,
                    "data-multiline": true
                }
                let max = this.props.altShiftState.shiftDown ? 100 : this.props.altShiftState.altDown ? 1000 : this.props.letterOptions.defaultPurchaseToMaxLimit;
                ttUpgradeMax = {
                    "data-tip": `Buy maximum number of autoconverters that you can while keeping previous letter's production above ${max}.<br>` +
                    "Hold shift and click to keep previous letter production above 100.<br>" +
                    "Hold alt and click to keep previous letter production above 1000.<br>" +
                    "If the previous letter's production is below zero the maximum number will be bought regardless of the previous letter's production.",
                    "data-multiline": true
                }
                ttCount = {
                    "data-tip": countRaw
                }
                ttPause = {
                    "data-tip": this.props.letter.paused ? 'Unpause' : 'Pause',
                    "data-delay-show": 2000
                }
                ttChange = {
                    "data-tip": `Generating: ${gen}<br>Spending:${spend}<br>Base change rate: ${this.props.letter.baseChange}`,
                    "data-multiline": true
                }
            }

            

            return (
                <div className={"letterBoxDiv" + addStyle} onClick={() => this.props.onClick(this.props.idx)}>
                    <MiniButton className="topRightCorner" borderless={true} onClick={()=>this.props.onLetterOptionsClick(this.props.idx)}>
                        <span className="smallText">🔧</span>
                    </MiniButton>
                    <div className="letterDiv">
                        {this.props.sym}
                    </div>
                    <MiniButton disabled={!this.props.letter.canUpgrade} onClick={(e) => this.onUpgradeClick(e)} borderColor="blue">
                        <span {...ttUpgradeOnce}>⇧</span>
                    </MiniButton>
                    <MiniButton disabled={!this.props.letter.canUpgradeMax} onClick={(e) => this.onMaxUpgradeClick(e)} borderColor="darkgreen">
                        <span {...ttUpgradeMax}>⇮</span>
                    </MiniButton>
                    {this.props.letter.level}
                    <div className="countDiv">
                        <span {...ttCount}>{count}</span>
                        (<span {...ttChange}>{change}</span>)
                    </div>
                    <div className="centerDiv">
                        <MiniButton className="miniButtonMarginless" borderless={true} onClick={() => this.props.onPauseClick(this.props.idx)}>
                            <span className="pauseButton" {...ttPause}>{pauseButtonSym}</span>
                        </MiniButton>
                    </div>
                </div>
            )
        }
    }
}
