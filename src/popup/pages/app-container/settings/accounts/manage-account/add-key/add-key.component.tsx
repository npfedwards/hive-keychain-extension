import { addKey } from '@popup/actions/account.actions';
import { goBack } from '@popup/actions/navigation.actions';
import { setTitleContainerProperties } from '@popup/actions/title-container.actions';
import { Icons } from '@popup/icons.enum';
import { RootState } from '@popup/store';
import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import ButtonComponent from 'src/common-ui/button/button.component';
import { InputType } from 'src/common-ui/input/input-type.enum';
import InputComponent from 'src/common-ui/input/input.component';
import { KeyType } from 'src/interfaces/keys.interface';
import './add-key.component.scss';

const AddKey = ({
  navParams,
  goBack,
  addKey,
  setTitleContainerProperties,
}: PropsType) => {
  const [privateKey, setPrivateKey] = useState('');

  useEffect(() => {
    setTitleContainerProperties({
      title: 'popup_html_add_key',
      isBackButtonEnabled: true,
    });
  });

  const importKey = async () => {
    addKey(privateKey.trim(), navParams);
    goBack();
  };

  return (
    <div className="add-key-page">
      <p
        className="introduction"
        dangerouslySetInnerHTML={{
          __html: chrome.i18n.getMessage('popup_html_add_key_text'),
        }}></p>

      <InputComponent
        type={InputType.PASSWORD}
        logo={Icons.KEY}
        placeholder="popup_html_private_key"
        value={privateKey}
        onChange={setPrivateKey}
        onEnterPress={importKey}
      />
      <ButtonComponent
        label="popup_html_import_key"
        onClick={importKey}
        fixToBottom
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    navParams: state.navigation.stack[0].params as KeyType,
  };
};

const connector = connect(mapStateToProps, {
  goBack,
  addKey,
  setTitleContainerProperties,
});
type PropsType = ConnectedProps<typeof connector>;

export const AddKeyComponent = connector(AddKey);
