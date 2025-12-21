/* eslint-disable */
import React, { useContext } from 'react';
import './styles/index.scss';
import { ObjectContext } from '../../context';
import { toast } from 'react-toastify';
import { PlusCircleOutlined } from '@ant-design/icons';

import GlobalCustomButton from '../../components/buttons/CustomButton';
import Input from '../../components/inputs/basic/Input';
import { useForm } from 'react-hook-form';
import client from '../../feathers';

const AddHealthConditions = ({ closeModal }) => {
  const { register, handleSubmit } = useForm();
  const ClientServ = client.service('client');
  const { state, showActionLoader, setState, hideActionLoader } =
    useContext(ObjectContext);
  let Client = state.ClientModule.selectedClient;

  const onSubmit = (data) => {
    showActionLoader();
    const updateClient = { ...Client, ...data };

    ClientServ.patch(Client._id, updateClient)
      .then((res) => {
        const newClientModule = {
          selectedClient: res,
          show: 'detail',
        };
        setState((prevstate) => ({
          ...prevstate,
          ClientModule: newClientModule,
        }));
        hideActionLoader();
        closeModal();
        toast.success(`You've successfully uploaded a document`);
      })
      .catch((err) => {
        hideActionLoader();
        toast.error(`Sorry, You weren't able to upload the document. ${err}`);
      });
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '16px',
        }}
      >
        <GlobalCustomButton type="submit" onClick={handleSubmit(onSubmit)}>
          <PlusCircleOutlined style={{ marginRight: '5px' }} />
          Add
        </GlobalCustomButton>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <Input
            label="Specific Instructions"
            name="specificDetails"
            type="text"
            register={register('specificDetails')}
          />
        </div>

        <div>
          <Input
            label="Allergies"
            name="allergies"
            type="text"
            register={register('allergies')}
          />
        </div>

        <div>
          <Input
            label="Co-morbidities"
            name="comorbidities"
            type="text"
            register={register('comorbidities')}
          />
        </div>

        <div>
          <Input
            label="Disabilities"
            name="disabilities"
            type="text"
            register={register('disabilities')}
          />
        </div>
      </div>
    </div>
  );
};

export default AddHealthConditions;
