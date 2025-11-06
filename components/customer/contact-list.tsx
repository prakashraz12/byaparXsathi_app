import { Search } from 'lucide-react-native';
import { useMemo,useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/constants/Colors';
import { IContact } from '@/types/common';

import AvatarCard from '../re-usables/avatar-card';
import Input from '../re-usables/input';
import NotFound from '../re-usables/not-found';
import { Text } from '../re-usables/text';

interface IContactList {
  contacts: IContact[];
  onClickContact?: (contact: IContact) => void;
  loading?: boolean;
}
const ContactList = ({ contacts, onClickContact, loading }: IContactList) => {
  const [searchContact, setSearchContact] = useState<string>('');
  const filterContact = useMemo(() => {
    return contacts?.filter((contact) => {
      return contact?.name?.toLowerCase()?.includes(searchContact?.toLowerCase() || '');
    });
  }, [contacts, searchContact]);
  return (
    <View style={{ marginBottom: 130 }}>
      <Input
        value={searchContact}
        onChangeText={setSearchContact}
        placeholder="Search"
        leftIcon={<Search size={20} />}
      />
      {loading ? (
        <View style={{ flex: 1, height: 400, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : filterContact?.length > 0 ? (
        filterContact
          ?.filter((contact) => contact?.phoneNumbers?.length > 0)
          ?.map((contact, index) => (
            <TouchableOpacity
              onPress={() => {
                onClickContact?.(contact);
              }}
              style={{
                flexDirection: 'row',
                marginVertical: 8,
                gap: 16,
                padding: 20,
                borderWidth: 0.5,
                borderColor: COLORS.border,
                borderRadius: 8,
                alignItems: 'center',
              }}
              key={index}
            >
              <AvatarCard name={contact?.name || 'UN'} size={55} />
              <View style={{ flexDirection: 'column', gap: 4 }}>
                <Text>{contact?.name}</Text>
                <Text style={{ color: COLORS.textLight, fontSize: 12 }}>
                  {contact?.phoneNumbers?.[0]?.number}
                </Text>
              </View>
            </TouchableOpacity>
          ))
      ) : (
        <NotFound title="No Contact Found" description="You don't have any contact on you phone." />
      )}
    </View>
  );
};

export default ContactList;
