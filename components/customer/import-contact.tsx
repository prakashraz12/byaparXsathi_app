import * as Contacts from 'expo-contacts';
import { UserPlus } from 'lucide-react-native';

import { COLORS } from '@/constants/Colors';

import { Button } from '../re-usables/button';
import { Toast } from '../re-usables/custom-toaster/toast-service';

interface IImportContact {
  mode: 'ADD' | 'IMPORT';
  setMode: (mode: 'ADD' | 'IMPORT') => void;
  setContacts: (contacts: any[]) => void;
  setImportingContactLoading: (loading: boolean) => void;
}
const ImportContact = ({
  mode,
  setMode,
  setContacts,
  setImportingContactLoading,
}: IImportContact) => {
  //first check is user allow to contact permission//
  const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      setImportingContactLoading(true);
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails, Contacts.Fields.Addresses],
      });

      if (data?.length > 0) {
        setContacts(data);
      }
      setImportingContactLoading(false);
    } else {
      Toast.error('Permission denied');
      setImportingContactLoading(false);
    }
  };
  return (
    <Button
      title={mode === 'ADD' ? 'Import Contact' : 'Add Contact'}
      variant="outline"
      style={{ width: '45%', borderWidth: 0 }}
      leftIcon={<UserPlus size={20} color={COLORS.primary} />}
      onPress={() => {
        getContacts();
        setMode(mode === 'ADD' ? 'IMPORT' : 'ADD');
      }}
    />
  );
};

export default ImportContact;
