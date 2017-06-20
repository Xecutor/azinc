import * as React from "react";

type NumberFormat = 'standard' | 'scientific' | 'engineering';
export class Options {
    numberFormat: NumberFormat = 'standard';
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
        let updatedOptions = new Options;
        updatedOptions.numberFormat = event.target.value as NumberFormat;
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
                Numbers format:
                <select value={this.props.options.numberFormat} onChange={(event) => this.onNumFormatChange(event)}>
                    {
                        numFormatOptions.map((no) => <option key={no.value} value={no.value}>{no.name}</option>)
                    }
                </select>
                <br />
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
