import { resetMessage } from '@popup/actions/message.actions';
import { RootState } from '@popup/store';
import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import './message-container.component.scss';

const MessageContainer = ({ errorMessage, resetMessage }: PropsFromRedux) => {
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [timeoutId, setTimeoutId] = useState<any>();
  useEffect(() => {
    if (errorMessage.key) {
      setProgressBarWidth(100);
      const t = setTimeout(() => {
        resetMessage();
        setProgressBarWidth(0);
      }, 5000);
      setTimeoutId(t);
    }
  }, [errorMessage]);

  const close = () => {
    clearTimeout(timeoutId);
    resetMessage();
    setProgressBarWidth(0);
  };

  return (
    <div className="message-container" onClick={() => close()}>
      {errorMessage.key.length > 0 && (
        <div className={`container ${errorMessage.type}`}>
          <div className="barHolder">
            <div
              className="bar"
              style={{ width: progressBarWidth + '%' }}></div>
          </div>
          <div className="message">
            {chrome.i18n.getMessage(errorMessage.key, errorMessage.params)}
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    errorMessage: state.errorMessage,
  };
};

const connector = connect(mapStateToProps, { resetMessage });
type PropsFromRedux = ConnectedProps<typeof connector>;

export const MessageContainerComponent = connector(MessageContainer);
