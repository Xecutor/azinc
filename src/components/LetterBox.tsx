import * as React from "react";
import * as ReactDOM from 'react-dom';
import {LetterRecord} from './MainGame';
import {Options} from './Options';
import {format} from 'swarm-numberformat';
import ReactTooltip = require('react-tooltip');


interface LetterBoxProps{
    sym:string;
    idx:number;
    letter:LetterRecord;

    ascend?:boolean;

    options:Options;

    onClick:(idx:number)=>void;
    onUpgradeClick:(idx:number, max:boolean)=>void;
    onPauseClick:(idx:number)=>void;
    onAscendClick:()=>void;
}

export class LetterBox extends React.Component<LetterBoxProps, undefined> {
    render()
    {
        if(this.props.idx==0) {
            return (
                <div className="letterBoxDiv" onClick={()=>this.props.onClick(this.props.idx)}>
                    <div className="letterDivInf">{this.props.sym}</div>
                    {
                        this.props.ascend && <button onClick={this.props.onAscendClick}>Ascend</button>
                    }
                </div>
            )
        }
        else {
            let pauseButtonSym = this.props.letter.paused ? '▶' : '∥';
            let fmt = this.props.options.numberFormat;
            let lc=format(this.props.letter.change, {format:fmt, flavor:'short'});
            let change=this.props.letter.change>0?'+'+lc:lc;
            let count=format(this.props.letter.count, {format:fmt, flavor:'short'});
            let countRaw=this.props.letter.count.toString();
            return (
                <div className="letterBoxDiv" onClick={()=>this.props.onClick(this.props.idx)}>
                    <div className="letterDiv">{this.props.sym}</div>
                    <div 
                        className="upgradeButton" 
                        data-tip={"Upgrade once "+count} 
                        onClick={()=>this.props.onUpgradeClick(this.props.idx, false)}
                    >⇧</div>
                    <div className="upgradeButton" onClick={()=>this.props.onUpgradeClick(this.props.idx, true)}>⇮</div>
                    {this.props.letter.level}
                    <div className="countDiv">
                        <span data-tip={countRaw}>{count}</span>
                        ({change})
                    </div>
                    <div className="centerDiv">
                        <div 
                            className="pauseButton"
                            data-tip={this.props.letter.paused?'Unpause':'Pause'}
                            data-event-off='mouseleave click'
                            data-delay-show="2" 
                            onClick={()=>this.props.onPauseClick(this.props.idx)}
                        >
                            {pauseButtonSym}
                        </div>
                    </div>
                </div>
            )
        }
    }
}