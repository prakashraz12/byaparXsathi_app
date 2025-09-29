import * as Contacts from "expo-contacts";
import { View } from "react-native";
import { Button } from "../re-usables/button";
import { UserPlus } from "lucide-react-native";
import { COLORS } from "@/constants/Colors";
import { Toast } from "../re-usables/custom-toaster/toast-service";

interface IImportContact {
  mode: "ADD" | "IMPORT";
  setMode: (mode: "ADD" | "IMPORT") => void;
  setContacts: (contacts: any[]) => void;
}
const ImportContact = ({ mode, setMode, setContacts }: IImportContact) => {
  //first check is user allow to contact permission//
  const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails, Contacts.Fields.Addresses],
      });

      if(data?.length>0){
        setContacts(data)
      }
    } else {
      Toast.error("Permission denied")
    }
  };
  return (
      <Button
        title={mode === "ADD" ? "Import Contact" : "Add Contact"}
        variant="outline"
        style={{ width: "45%", borderWidth:0 }}
        leftIcon={<UserPlus size={20} color={COLORS.primary} />}
        onPress={() => {
          getContacts()
          setMode(mode === "ADD" ? "IMPORT" : "ADD")
        }}
      />
    
  );
};

export default ImportContact;
