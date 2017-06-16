import * as React from "react";
import {ModalDialog, ModalContainer} from 'react-modal-dialog';
import ReactTooltip = require('react-tooltip');
import {Options, OptionsComponent} from './Options';
import {AscensionComponent, Upgrades} from './Ascension'

import { MainGame, LetterRecord, maxLettersCount } from "./MainGame";

interface GameRootState {
    letters:Array< LetterRecord >;
    optionsOpened:boolean;
    ascension: boolean;
    options:Options;
    upgrades: Upgrades;
}



export class GameRoot extends React.Component< undefined, GameRootState > {
    
    timerId:number;
    lastUpdate:number;
    lastSave:number;

    tooltip:ReactTooltip;

    multipliers=new Array<number>(maxLettersCount);

    constructor()
    {
        super();
        this.state = {
            letters: [new LetterRecord],
            optionsOpened: false,
            ascension: false,
            options: new Options,
            upgrades: new Upgrades

        };
        this.timerId = setInterval(() => this.onTimer(), 1000);
        this.lastUpdate = performance.now();
        this.lastSave = this.lastUpdate;
        this.load();
        window.onunload = () => this.save();
    }

    save()
    {
        if(localStorage) {
            let saveData = JSON.stringify(this.state);
            localStorage.setItem("azincsave", saveData);
        }
    }

    updateMultipliers(u:Upgrades)
    {
        const mulRanges:{[key:string]:number[]}={
            multAE:[1,5],
            multFJ:[6,10],
            multKO:[11,15],
            multPT:[16,20],
            multUZ:[21,26]
        }
        for (let i = 0; i < this.multipliers.length; ++i)this.multipliers[i] = 1;
        for(let k in u) {
            if (u[k]) {
                let r = mulRanges[k];
                if(r) {
                    for(let i=r[0];i<=r[1];++i) {
                        this.multipliers[i]=2;
                    }
                }
            }
        }
    }

    load()
    {
        let savedData=localStorage && localStorage.getItem("azincsave");
        if(savedData) {
            let parsedData=JSON.parse(savedData);
            if(parsedData) {
                if(!parsedData.options)parsedData.options=new Options;
                if(!parsedData.upgrades)parsedData.upgrades=new Upgrades;
                if(parsedData.letters.length>maxLettersCount) {
                    parsedData.letters=parsedData.letters.slice(0, maxLettersCount);
                }
                this.state=parsedData;
                this.updateMultipliers(this.state.upgrades);
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
        if(mul>15) {
            mul=10+Math.floor((mul-15)/4);
        }else if(mul>5) {

            mul=5+Math.floor((mul-5)/2);
        }
        if(mul < 1) {
            mul=1;
        }
        mul*=this.multipliers[idx];
        return [cnt, mul];
    }

    updateChange(newLetters:Array< LetterRecord>)
    {
        for(let i=1;i<newLetters.length;++i) {
            let [cnt, mul]=this.calcInc(newLetters, i, false);
            let [cnt2]=this.calcInc(newLetters, i + 1, false);
            newLetters[i].change=cnt*mul-cnt2*10;
        }
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

    componentDidUpdate(prevProps:any, prevState:GameRootState)
    {
        if(this.state.letters.length!=prevState.letters.length) {
            ReactTooltip.rebuild();        
        }
        if(this.tooltip.state.show) {
            let tgt = this.tooltip.state.currentTarget;
            let tip = tgt.getAttribute('data-tip');
            if(tgt.getAttribute('data-multiline')) {
                tip=tip.split('<br>').map((txt:string,idx:number)=><span className='multi-line' key={idx}>{txt}</span>);
            }
            this.tooltip.setState({
                placeholder:tip
            });
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
            newLetters[idx].count+=this.multipliers[idx];
            if(idx > 1)newLetters[idx-1].count-= 10;
            if(idx == newLetters.length-1 && newLetters[idx].count>=10 && newLetters.length<maxLettersCount) {
                newLetters.push(new LetterRecord);
            }
            this.setState({letters:newLetters});
        }
    }

    onUpgradeClick(idx:number, count:number)
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
            if(idx>1 && count<0 && startChange>0 && curChange<=10) {
                break;
            }
            newLetters[idx].level++;
            newLetters[idx+1].count-=ucost;
            curChange-=10;
            updated=true;
        }while(count<0 || (--count)!=0);
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

    updateOptionsDiv(d:HTMLElement)
    {
        if(d) {
            d.style.color='#000001';
            setTimeout(function(){
                d.style.color='#000000';
            }, 500);
        }
    }

    onOptionsUpdate(updatedOptions:Options)
    {
        this.setState({options: updatedOptions});
    }

    resetState(upgrades:Upgrades)
    {
        this.setState({upgrades:upgrades, ascension:false, letters:[new LetterRecord]});
        this.updateMultipliers(upgrades);
    }

    onHardReset()
    {
        this.setState({optionsOpened:false});
        this.resetState(new Upgrades);
    }

    onAscendClick()
    {
        this.setState({ascension:true});
    }

    onBuyUpgrade(key:keyof Upgrades)
    {
        let newUpgrades={...this.state.upgrades};
        newUpgrades[key]=true;
        this.resetState(newUpgrades);
    }

    onGetContent(elem:HTMLElement)
    {
        return elem.getAttribute('data-tip') || '';
    }

    render()
    {
        return (
            <div>
                <div className="optionsButton" onClick={()=>this.onOptionsClick()}>⚙</div>
                {
                    this.state.optionsOpened && 
                    <ModalContainer onClose={()=>this.onOptionsClose()}>
                        <ModalDialog onClose={()=>this.onOptionsClose()}>
                            <div ref={(d)=>this.updateOptionsDiv(d)}>
                                <OptionsComponent 
                                    options={this.state.options}
                                    onChange={(updatedOptions:Options)=>this.onOptionsUpdate(updatedOptions)}
                                    onHardReset={()=>this.onHardReset()}
                                />
                            </div>
                        </ModalDialog>
                    </ModalContainer>
                }
                <div className="container">
                    {
                        this.state.ascension ?
                        <AscensionComponent 
                            upgrades={this.state.upgrades}
                            onBuyUpgrade={(key:keyof Upgrades)=>this.onBuyUpgrade(key)}
                        />
                        :
                        <MainGame 
                            letters={this.state.letters}
                            options={this.state.options}
                            onLetterClick={(idx)=>this.onLetterClick(idx)}
                            onUpgradeClick={(idx, max)=>this.onUpgradeClick(idx, max)}
                            onPauseClick={(idx)=>this.onPauseClick(idx)}
                            onAscendClick={()=>this.onAscendClick()}
                        />
                    }
                </div>
                <ReactTooltip
                    effect={'float'}
                    ref={(tt)=>this.tooltip=tt}
                />
            </div>
        );
    }
}