import * as React from 'react';

export interface ModalDialogProperties {
  onClose:()=>void;
}

export interface ModalContainerProperties {
  onClose:()=>void;
}

export class ModalDialog extends React.Component<ModalDialogProperties, any> {

}

export class ModalContainer extends React.Component<ModalContainerProperties, any> {

}

//export class ModalDialog;
