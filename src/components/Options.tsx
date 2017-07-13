import * as React from "react";

type NumberFormat = 'standard' | 'scientific' | 'engineering';
export class Options {
    numberFormat: NumberFormat = 'standard';
    showTooltips = true;
    showAltShiftIndicator = false;
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
    onSoftReset: () => void;
}

class OptionsState {
    showHardConfirm: boolean;
    showSoftConfirm: boolean;
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

    onAltShiftInfChange(event: React.ChangeEvent<HTMLInputElement>)
    {
        let updatedOptions = {...this.props.options};
        updatedOptions.showAltShiftIndicator = event.target.checked;
        this.props.onChange(updatedOptions);
    }

    onHardResetClick() {
        this.setState({ showHardConfirm: true });
    }

    onSoftResetClick() {
        this.setState({ showSoftConfirm: true });
    }

    onNevermindHardClick() {
        this.setState({ showHardConfirm: false });
    }

    onNevermindSoftClick() {
        this.setState({ showSoftConfirm: false });
    }

    render() {
        return (
            <div>
                <table>
                    <tbody>
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
                    <tr>
                        <td className="alignLeft">Show shift&alt indicator:</td>
                        <td className="alignLeft">
                            <input type="checkbox" checked={this.props.options.showAltShiftIndicator} onChange={(event)=>this.onAltShiftInfChange(event)}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div>
                <button onClick={() => this.onHardResetClick()} className="hardResetButton">HARD RESET</button>
                {
                    this.state.showHardConfirm && (
                        <div>
                            <button onClick={this.props.onHardReset} className="hardResetButton">Confirm HARD RESET</button>
                            <button onClick={() => this.onNevermindHardClick()}>Nevermind</button>
                        </div>
                    )
                }
                </div>
                <div>
                <button onClick={() => this.onSoftResetClick()} className="softResetButton">SOFT RESET</button>
                {
                    this.state.showSoftConfirm && (
                        <div>
                            <button onClick={this.props.onSoftReset} className="softResetButton">Confirm SOFT RESET</button>
                            <button onClick={() => this.onNevermindSoftClick()}>Nevermind</button>
                        </div>
                    )
                }
                </div>
            </div>
        )
    }
}
