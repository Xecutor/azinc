import * as React from "react";
import {LetterRecord} from './MainGame';

interface LetterBoxProps{
    sym:string;
    idx:number;
    letter:LetterRecord;

    onClick:(idx:number)=>void;
    onUpgradeClick:(idx:number, max:boolean)=>void;
    onPauseClick:(idx:number)=>void;
}

export class LetterBox extends React.Component<LetterBoxProps, undefined> {
    render()
    {
        if(this.props.idx==0) {
            return (
                <div className="letterBoxDiv" onClick={()=>this.props.onClick(this.props.idx)}>
                    <div className="letterDivInf">{this.props.sym}</div>
                </div>
            )
        }
        else {
            let pauseButtonSym = this.props.letter.paused ? '▶' : '∥';
            let lc=this.props.letter.change;
            let change=lc>0?'+'+lc.toString():lc.toString();
            return (
                <div className="letterBoxDiv" onClick={()=>this.props.onClick(this.props.idx)}>
                    <div className="letterDiv">{this.props.sym}</div>
                    <div className="upgradeButton" data-tip="Upgrade once" onClick={()=>this.props.onUpgradeClick(this.props.idx, false)}>⇧</div>
                    <div className="upgradeButton" onClick={()=>this.props.onUpgradeClick(this.props.idx, true)}>⇮</div>
                    {this.props.letter.level}
                    <div className="countDiv">{this.props.letter.count}({change})</div>
                    <div className="centerDiv">
                        <div 
                            className="pauseButton"
                            data-tip={this.props.letter.paused?'Unpause':'Pause'}
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