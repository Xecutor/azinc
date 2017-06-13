import * as React from "react";

export class Upgrades{
    autoGetLast=false;
    adMult=false;
    upgrade1=false;
    upgrade2=false;
    [index:string]:boolean;
}

const upgradesDesc:Array<{key:keyof Upgrades, desc:string}> = [
    {key:'autoGetLast', desc:'Automatically get last letter once available'},
    {key:'adMult', desc:'Double conversion rate of letters a-d'},
    {key:'upgrade1', desc:'Test upgrade 1'},
    {key:'upgrade2', desc:'Test upgrade 2'},
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
                        upgradesDesc.map((ud)=>
                            <tr>
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
