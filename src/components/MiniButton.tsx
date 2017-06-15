import * as React from "react";

interface MiniButtonProps{
    onClick:(e:React.MouseEvent<HTMLElement>)=>void;
    borderless?:boolean;
    disabled?:boolean;
    normalColor?:string;
    disabledColor?:string;
    borderColor?:string;
}

export class MiniButton extends React.Component<MiniButtonProps, undefined> {
    onClick(e:React.MouseEvent<HTMLElement>)
    {
        e.preventDefault();
        this.props.onClick(e);
    }
    render() 
    {
        const dcolor = this.props.disabledColor?this.props.disabledColor:'gray';
        const ncolor = this.props.normalColor?this.props.normalColor:'black';
        let textColor = this.props.disabled?dcolor:ncolor;
        let style : any = {
            color: textColor
        };
        if(!this.props.borderless) {
            let bcolor = this.props.borderColor?this.props.borderColor:'black';
            style.border=`1px solid ${bcolor}`;
        }
        let buttonProps :any = {
            className:"miniButton",
            style: style
        }
        return <div {...buttonProps} onClick={(e)=>this.onClick(e)}>{this.props.children}</div>
    }
}
