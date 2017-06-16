import * as React from "react";

export class Upgrades{
    autoGetLast=false;
    multAE=false;
    multFJ=false;
    multKO=false;
    multPT=false;
    multUZ=false;
    [key:string]:boolean;
}

//type DescArr<T, K extends keyof T> = Array<{key:[P in K]}

const upgradesDesc:Array<{key:keyof Upgrades, desc:string}> = [
    {key:'autoGetLast', desc:'Automatically get last letter once available'},
    {key:'multAE', desc:'Double conversion rate of letters A-E'},
    {key:'multFJ', desc:'Double conversion rate of letters F-J'},
    {key:'multKO', desc:'Double conversion rate of letters L-O'},
    {key:'multPT', desc:'Double conversion rate of letters P-T'},
    {key:'multUZ', desc:'Double conversion rate of letters U-Z'},
]


class AscensionProps {
    upgrades: Upgrades;
    onBuyUpgrade:(key:keyof Upgrades)=>void;
}

export class AscensionComponent extends React.Component< AscensionProps, any > {
    render()
    {
        return (
            <table>
                <tbody>
                    {
                        upgradesDesc.map((ud,idx)=>
                            <tr key={idx}>
                                <td>
                                    {
                                        !this.props.upgrades[ud.key] && 
                                        <button onClick={()=>this.props.onBuyUpgrade(ud.key)}>Buy</button>
                                    }
                                </td>
                                <td key={ud.key} className="upgradeDescTd">{ud.desc}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        )
    }
}
