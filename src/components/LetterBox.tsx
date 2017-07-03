import * as React from "react";
import * as ReactDOM from 'react-dom';
import { LetterRecord } from './MainGame';
import { Options } from './Options';
import { format } from 'swarm-numberformat';
import ReactTooltip = require('react-tooltip');
import { MiniButton } from './MiniButton';


interface LetterBoxProps {
    sym: string;
    idx: number;
    letter: LetterRecord;

    ascend?: boolean;

    options: Options;

    onClick: (idx: number) => void;
    onUpgradeClick: (idx: number, count: number) => void;
    onPauseClick: (idx: number) => void;
    onAscendClick: () => void;
}

export class LetterBox extends React.Component<LetterBoxProps, undefined> {
    onUpgradeClick(e: React.MouseEvent<HTMLElement>) {
        this.props.onUpgradeClick(this.props.idx, e.altKey ? 100 : e.shiftKey ? 10 : 1);
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
            // <div 
            //     className="upgradeButton" 
            //     data-tip={"Increment autoconversion level by 1<br>Click with shift pressed to increment by 10<br>Click with alt pressed to increment by 100"} 
            //     data-multiline={true}
            //     onClick={(e)=>this.onUpgradeClick(e)}
            // >⇧</div>
            return (
                <div className={"letterBoxDiv" + addStyle} onClick={() => this.props.onClick(this.props.idx)}>
                    <div className="letterDiv">{this.props.sym}</div>
                    <MiniButton onClick={(e) => this.onUpgradeClick(e)} borderColor="blue">
                        <span
                            data-tip="Increment autoconversion level by 1<br>Click with shift pressed to increment by 10<br>Click with alt pressed to increment by 100"
                            data-multiline={true}
                        >
                            ⇧
                        </span>
                    </MiniButton>
                    <MiniButton
                        onClick={() => this.props.onUpgradeClick(this.props.idx, -1)}
                        borderColor="darkgreen"
                    >⇮</MiniButton>
                    {this.props.letter.level}
                    <div className="countDiv">
                        <span data-tip={countRaw}>{count}</span>
                        ({change})
                    </div>
                    <div className="centerDiv">
                        <div
                            className="pauseButton"
                            data-tip={this.props.letter.paused ? 'Unpause' : 'Pause'}
                            data-delay-show="2000"
                            onClick={() => this.props.onPauseClick(this.props.idx)}
                        >
                            {pauseButtonSym}
                        </div>
                    </div>
                </div>
            )
        }
    }
}