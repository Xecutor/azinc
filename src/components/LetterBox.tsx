import * as React from "react";
import * as ReactDOM from 'react-dom';
import { LetterRecord } from './MainGame';
import { Options } from './Options';
import { format } from 'swarm-numberformat';
import ReactTooltip = require('react-tooltip');
import { MiniButton } from './MiniButton';
import {AltShiftState} from './GameRoot'

interface LetterBoxProps {
    sym: string;
    idx: number;
    letter: LetterRecord;

    canUpgrade : boolean;
    canUpgradeMax : boolean;

    altShiftState: AltShiftState;

    ascend?: boolean;

    options: Options;

    onClick: (idx: number) => void;
    onUpgradeClick: (idx: number, count: number, min: number) => void;
    onPauseClick: (idx: number) => void;
    onAscendClick: () => void;
}

export class LetterBox extends React.Component<LetterBoxProps, undefined> {
    onUpgradeClick(e: React.MouseEvent<HTMLElement>) {
        this.props.onUpgradeClick(this.props.idx, e.altKey ? 100 : e.shiftKey ? 10 : 1, 10);
    }
    onMaxUpgradeClick(e: React.MouseEvent<HTMLElement>) {
        this.props.onUpgradeClick(this.props.idx, -1, e.altKey ? 1009 : e.shiftKey ? 109 : 10);
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
            let lc = format(this.props.letter.change, { format: fmt, flavor: 'short' });
            let change = this.props.letter.change > 0 ? '+' + lc : lc;
            let count = format(this.props.letter.count, { format: fmt, flavor: 'short' });
            let countRaw = this.props.letter.count.toString();
            let addStyle = this.props.letter.paused ? " letterBoxDivPaused" : "";

            let ttUpgradeOnce = {};
            let ttUpgradeMax = {};
            let ttCount = {}
            let ttPause = {}
            if (this.props.options.showTooltips) {
                let upgradeCost = (this.props.letter.level + 1);
                if (this.props.altShiftState.shiftDown) {
                    upgradeCost *= 10;
                }
                else if (this.props.altShiftState.altDown) {
                    upgradeCost *= 100;
                }
                ttUpgradeOnce = {
                    "data-tip": "Increment auto conversion level by 1<br>" +
                    "Click with shift pressed to increment by 10<br>" +
                    "Click with alt pressed to increment by 100<br>" +
                    `Current upgrade cost: ${upgradeCost==1?upgradeCost : upgradeCost.toString() + ' of'} next letter${upgradeCost>1?'s':''}`,
                    "data-multiline": true
                }
                ttUpgradeMax = {
                    "data-tip": "Increment auto conversion level to maximum, while keeping change rate of<br>previous letter above certain limit (greater than zero by default)<br>" +
                    "Click with shift pressed to keep at least 100 of previous tier<br>" +
                    "Click with alt pressed to keep at least 1000 of previous tier",
                    "data-multiline": true
                }
                ttCount = {
                    "data-tip": countRaw
                }
                ttPause = {
                    "data-tip": this.props.letter.paused ? 'Unpause' : 'Pause',
                    "data-delay-show": 2000
                }
            }

            return (
                <div className={"letterBoxDiv" + addStyle} onClick={() => this.props.onClick(this.props.idx)}>
                    <div className="letterDiv">{this.props.sym}</div>
                    <MiniButton disabled={!this.props.canUpgrade} onClick={(e) => this.onUpgradeClick(e)} borderColor="blue">
                        <span {...ttUpgradeOnce}>⇧</span>
                    </MiniButton>
                    <MiniButton disabled={!this.props.canUpgradeMax} onClick={(e) => this.onMaxUpgradeClick(e)} borderColor="darkgreen">
                        <span {...ttUpgradeMax}>⇮</span>
                    </MiniButton>
                    {this.props.letter.level}
                    <div className="countDiv">
                        <span {...ttCount}>{count}</span>
                        ({change})
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