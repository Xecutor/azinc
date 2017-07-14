import * as React from "react";
import { MiniButton } from './MiniButton'

type UpgradeKeys = keyof Upgrades;

export class Upgrades {
    autoGetLast = false;

    multAE = false;
    multFJ = false;
    multKO = false;
    multPT = false;
    multUZ = false;

    convPurchaseAE = false;
    convPurchaseFJ = false;
    convPurchaseKO = false;
    convPurchasePT = false;
    convPurchaseUZ = false;

    autoUpgradeAE = false;
    autoUpgradeFJ = false;
    autoUpgradeKO = false;
    autoUpgradePT = false;
    autoUpgradeUZ = false;

    globalMult = false;
}

//type DescArr<T, K extends keyof T> = Array<{key:[P in K]}

const upgradesDesc: Array<{ key: keyof Upgrades, desc: string, isHidden?: boolean }> = [
    { key: 'autoGetLast', desc: 'Automatically get last letter when possible' },

    { key: 'multAE', desc: 'Double conversion rate of letters A-E' },
    { key: 'multFJ', desc: 'Double conversion rate of letters F-J' },
    { key: 'multKO', desc: 'Double conversion rate of letters K-O' },
    { key: 'multPT', desc: 'Double conversion rate of letters P-T' },
    { key: 'multUZ', desc: 'Double conversion rate of letters U-Z' },

    { key: 'convPurchaseAE', desc: 'Autoconvert to next tier to pay for upgrade if possible for letters A-E' },
    { key: 'convPurchaseFJ', desc: 'Autoconvert to next tier to pay for upgrade if possible for letters F-J' },
    { key: 'convPurchaseKO', desc: 'Autoconvert to next tier to pay for upgrade if possible for letters K-O' },
    { key: 'convPurchasePT', desc: 'Autoconvert to next tier to pay for upgrade if possible for letters P-T' },
    { key: 'convPurchaseUZ', desc: 'Autoconvert to next tier to pay for upgrade if possible for letters U-Z' },

    { key: 'autoUpgradeAE', desc: 'Increment autoconvertor level automatically when possible for letters A-E' },
    { key: 'autoUpgradeFJ', desc: 'Increment autoconvertor level automatically when possible for letters F-J' },
    { key: 'autoUpgradeKO', desc: 'Increment autoconvertor level automatically when possible for letters K-O' },
    { key: 'autoUpgradePT', desc: 'Increment autoconvertor level automatically when possible for letters P-T' },
    { key: 'autoUpgradeUZ', desc: 'Increment autoconvertor level automatically when possible for letters U-Z' },

    { key: 'globalMult', desc: 'Double conversion rate for all letters', isHidden: true },
]


class AscensionProps {
    upgrades: Upgrades;
    onBuyUpgrade: (key: keyof Upgrades) => void;
    onTranscendClick: () => void;
}

export class AscensionComponent extends React.Component<AscensionProps, any> {
    render() {
        let upgrades = this.props.upgrades;
        let showTranscend = upgradesDesc.every(d => upgrades[d.key]);
        let showHidden = upgradesDesc.every(d => upgrades[d.key] || d.isHidden);

        let table = upgradesDesc.filter(
            d => !d.isHidden || showHidden).map((ud, idx) =>
                <tr key={idx}>
                    <td>
                        {
                            this.props.upgrades[ud.key] ?
                                <span className="ownedText">Owned</span>
                                :
                                <MiniButton borderColor="gray" onClick={() => this.props.onBuyUpgrade(ud.key)}>
                                    <span className="smallText">Get</span>
                                </MiniButton>
                        }
                    </td>
                    <td key={ud.key} className="upgradeDescTd">{ud.desc}</td>
                </tr>
            );

        if (showTranscend) {
            table.push(
                <tr key="transcend">
                    <td colSpan={2}>
                        <MiniButton onClick={() => this.props.onTranscendClick()}>Transcend</MiniButton>
                    </td>
                </tr>
            );
        }

        return (
            <table>
                <tbody>
                    {
                        table
                    }
                </tbody>
            </table>
        )
    }
}
