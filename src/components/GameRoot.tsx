import * as React from "react";
import {ModalDialog, ModalContainer} from 'react-modal-dialog';
import ReactTooltip = require('react-tooltip');

import { MainGame, LetterRecord } from "./MainGame";

interface GameRootState {
    letters:Array< LetterRecord >;
    optionsOpened:boolean;
}



export class GameRoot extends React.Component< undefined, GameRootState > {
    
    timerId:number;
    lastUpdate:number;
    lastSave:number;

    constructor()
    {
        super();
        this.state={letters:[new LetterRecord], optionsOpened:false};
        this.timerId=setInterval(()=>this.onTimer(), 1000);
        this.lastUpdate=performance.now();
        this.lastSave=this.lastUpdate;
        this.load();
        window.onunload=()=>this.save();
    }

    save()
    {
        //localStorage.setItem("azincsave", JSON.stringify(this.state));
    }

    load()
    {
        let savedData=undefined;//localStorage.getItem("azincsave");
        if(savedData) {
            let parsedData=JSON.parse(savedData);
            if(parsedData) {
                this.state=parsedData;
                this.updateChange(this.state.letters);
            }
        }
    }

    calcInc(letters:Array< LetterRecord >, idx:number, checkOverflow=true):Array<number>
    {
        let l=letters[idx];
        if(!l || l.paused)return [0,0];
        let lp=letters[idx-1];
        let cnt = Math.abs((lp.count/10));
        if(!checkOverflow || idx==1 || cnt>l.level)cnt=l.level;
        let mul=letters.length-idx-2;
        if(mul < 1) {
            mul=1;
        }
        return [cnt, mul];
    }

    updateChange(newLetters:Array< LetterRecord>)
    {
        for(let i=1;i<newLetters.length;++i) {
            let [cnt, mul]=this.calcInc(newLetters, i, false);
            let [cnt2]=this.calcInc(newLetters, i + 1, false);
            newLetters[i].change=cnt*mul-cnt2*10;
        }
        //console.log(newLetters[6].change);
    }

    onTimer()
    {
        let now=performance.now();
        let newLetters=this.state.letters.slice();
        let updated = false;
        while(now-this.lastUpdate>1000) {
            for(let i=1;i < newLetters.length;++i) {
                let l=newLetters[i];
                let lp=newLetters[i-1];
                if(l.paused) {
                    continue;
                }
                if(i==1 || lp.count>=10) {
                    let [cnt, mul]= this.calcInc(newLetters, i)
                    l.count+=(cnt*mul);
                    lp.count-=cnt*10;
                    l.count=Math.round(l.count);
                    updated=true;
                }
            }
            this.lastUpdate+=1000;
        }
        if(updated) {
            this.updateChange(newLetters);
            this.setState({letters:newLetters});
        }
        if(now-this.lastSave>10) {
            this.save();
            this.lastSave=now;
        }
    }
    onLetterClick(idx:number)
    {
        let prevCount = idx < 2 ? 10 : this.state.letters[idx-1].count;
        if(this.state.letters.length == 1) {
            this.setState({letters:[...this.state.letters,new LetterRecord]});
        }
        if(idx > 0 && prevCount >= 10) {
            let newLetters=this.state.letters.slice();
            newLetters[idx].count++;
            if(idx > 1)newLetters[idx-1].count-= 10;
            if(idx == newLetters.length-1 && newLetters[idx].count>=10) {
                newLetters.push(new LetterRecord);
            }
            this.setState({letters:newLetters});
        }
    }
    onUpgradeClick(idx:number, max:boolean)
    {
        if(idx==this.state.letters.length-1) {
            return;
        }
        let letters=this.state.letters;
        let newLetters=letters.slice();
        let updated=false;
        let startChange=newLetters[idx - 1].change;
        let curChange=startChange;
        do {
            let ucost=newLetters[idx].level+1;
            if(ucost>newLetters[idx+1].count) {
                break;
            }
            if(idx>1 && max && startChange>0 && curChange<10) {
                break;
            }
            newLetters[idx].level++;
            newLetters[idx+1].count-=ucost;
            curChange-=10;
            updated=true;
        }while(max);
        if(updated) {
            this.updateChange(newLetters);
            this.setState({letters:newLetters});
        }
    }

    onPauseClick(idx:number)
    {
        let newLetters=this.state.letters.slice();
        newLetters[idx].paused=!newLetters[idx].paused;
        this.updateChange(newLetters);
        this.setState({letters:newLetters});
    }

    onOptionsClick()
    {
        this.setState({optionsOpened:true});
    }

    onOptionsClose()
    {
        this.setState({optionsOpened:false});
    }

    render()
    {
        return (
        <div>
            <ReactTooltip effect={'solid'}/>
            <div className="optionsButton" onClick={()=>this.onOptionsClick()}>⚙</div>
            {
                this.state.optionsOpened && 
                <ModalContainer onClose={()=>this.onOptionsClose()}>
                    <ModalDialog onClose={()=>this.onOptionsClose()}>
                        hello
                    </ModalDialog>
                </ModalContainer>
            }
            <div className="container">
                <MainGame 
                    letters={this.state.letters}
                    onLetterClick={(idx)=>this.onLetterClick(idx)}
                    onUpgradeClick={(idx, max)=>this.onUpgradeClick(idx, max)}
                    onPauseClick={(idx)=>this.onPauseClick(idx)}
                />
            </div>
        </div>
        );
    }
}