import { navigateToWithParams } from '@popup/actions/navigation.actions';
import { RootState } from '@popup/store';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ActionButton } from 'src/interfaces/action-button.interface';
import './action-button.component.scss';

const ActionButton = ({
  label,
  icon,
  importedIcon,
  nextScreen,
  nextScreenParams,
  navigateToWithParams,
}: PropsType) => {
  return (
    <div
      className="action-button"
      onClick={() => navigateToWithParams(nextScreen, nextScreenParams)}>
      <div className="icon-container">
        {!importedIcon && (
          <span className="material-icons-outlined icon">{icon}</span>
        )}
        {importedIcon && (
          <img className="icon imported-icon" src={`/assets/images/${icon}`} />
        )}
      </div>
      <div className="label">{chrome.i18n.getMessage(label)}</div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {};
};

const connector = connect(mapStateToProps, {
  navigateToWithParams,
});
type PropsType = ConnectedProps<typeof connector> & ActionButton;

export const ActionButtonComponent = connector(ActionButton);
