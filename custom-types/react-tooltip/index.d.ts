import * as React from 'react';

type StringOrReactText = string | React.ReactText;
type GetContentFunc = (e:HTMLElement)=>StringOrReactText;

interface ReactTooltipProps {
    place?:'top'|'bottom'|'left'|'right';
    type?:'success'|'warning'|'error'|'info'|'light';
    effect?:'solid'|'float';
    event?:string;
    eventOff?:string;
    isCapture?:boolean;
    offset?:{top?:number, left?:number, right?:number, bottom?:number};
    multiline?:boolean;
    className?:string;
    html?:boolean;
    delayHide?:number;
    delayShow?:number;
    insecure?:boolean;
    border?:boolean;
    getContent?:GetContentFunc | Array<number|GetContentFunc>;
    afterShow?:()=>void;
    afterHide?:()=>void;
    disable?:boolean;
    scrollHide?:boolean;
    resizeHide?:boolean;
    wrapper?:'div'|'span';
}

declare class ReactTooltip extends React.Component<ReactTooltipProps, any> {
    static rebuild():void;
}

export = ReactTooltip;
