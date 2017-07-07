import * as React from "react";

type NumberFormat = 'standard' | 'scientific' | 'engineering';
export class Options {
    numberFormat: NumberFormat = 'standard';
    showTooltips = true;
}

const numFormatOptions = [
    { name: 'Standard', value: 'standard' },
    { name: 'Scientific', value: 'scientific' },
    { name: 'Engineering', value: 'engineering' }
]

class OptionsProps {
    options: Options;
    onChange: (updatedOptions: Options) => void;
    onHardReset: () => void;
}

class OptionsState {
    showConfirm: boolean;
}

export class OptionsComponent extends React.Component<OptionsProps, any> {
    constructor() {
        super();
        this.state = {
            showConfirm: false
        }
    }

    onNumFormatChange(event: React.ChangeEvent<HTMLSelectElement>) {
        let updatedOptions = {...this.props.options};
        updatedOptions.numberFormat = event.target.value as NumberFormat;
        this.props.onChange(updatedOptions);
    }

    onTooltipChange(event: React.ChangeEvent<HTMLInputElement>)
    {
        let updatedOptions = {...this.props.options};
        updatedOptions.showTooltips = event.target.checked;
        this.props.onChange(updatedOptions);
    }

    onHardResetClick() {
        this.setState({ showConfirm: true });
    }

    onNevermindClick() {
        this.setState({ showConfirm: false });
    }

    render() {
        return (
            <div>
                <table>
                    <tr>
                        <td className="alignLeft">Numbers format:</td>
                        <td className="alignLeft">
                            <select value={this.props.options.numberFormat} onChange={(event) => this.onNumFormatChange(event)}>
                                {
                                    numFormatOptions.map((no) => <option key={no.value} value={no.value}>{no.name}</option>)
                                }
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td className="alignLeft">Show tooltips:</td>
                        <td className="alignLeft">
                            <input type="checkbox" checked={this.props.options.showTooltips} onChange={(event)=>this.onTooltipChange(event)}/>
                        </td>
                    </tr>
                </table>
                <button onClick={() => this.onHardResetClick()} className="hardResetButton">HARD RESET</button>
                {
                    this.state.showConfirm && (
                        <div>
                            <button onClick={this.props.onHardReset} className="hardResetButton">Confirm HARD RESET</button>
                            <button onClick={() => this.onNevermindClick()}>Nevermind</button>
                        </div>
                    )
                }
            </div>
        )
    }
}
