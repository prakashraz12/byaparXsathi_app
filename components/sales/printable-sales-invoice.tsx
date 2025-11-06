import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import Sales from '@/database/model/sales.model';
import SalesItem from '@/database/model/sales-item.model';
import Shop from '@/database/model/shop.model';
import { salesInvoiceTemplate } from '@/utils/pdf-templates/sales-invoice';

export async function checkFileExistence(filePath: string) {
  try {
    const fileStat = await FileSystem.getInfoAsync(filePath);
    return fileStat.exists;
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
}

export async function generatePDF({
  SALES,
  salesItems,
  shopData,
}: {
  SALES: Sales;
  salesItems: SalesItem[];
  shopData: Shop;
}) {
  try {
    // Request media permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission not granted to access media library');
      return;
    }

    console.log(status, 'this is status');

    // Generate the HTML invoice
    const html = salesInvoiceTemplate(SALES, salesItems, shopData);
    const { uri } = await Print.printToFileAsync({ html, base64: false });

    if (!uri) {
      alert('Failed to generate PDF');
      return;
    }

    const fileName = `invoice-${SALES.invoiceNumber}.pdf`;
    const newUri = `${FileSystem.documentDirectory}${fileName}`;

    // Check if file already exists
    const checkFileExists = await checkFileExistence(newUri);
    if (checkFileExists) {
      alert('File already exists');
      return;
    }

    // Ensure the directory exists (not the file!)
    const directory = FileSystem.documentDirectory;
    if (directory) {
      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, {
          intermediates: true,
        });
      }
    }

    // Move file to the new location
    await FileSystem.moveAsync({
      from: uri,
      to: newUri,
    });

    console.log('newUri', newUri);

    if (Platform.OS === 'android') {
      // Create asset and save to MediaLibrary
      const asset = await MediaLibrary.createAssetAsync(newUri);

      // Try to add to Downloads album (more appropriate for invoices)
      let album = await MediaLibrary.getAlbumAsync('Download');
      if (!album) {
        // If Download doesn't exist, create it
        album = await MediaLibrary.createAlbumAsync('Download', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
      }

      alert('✅ PDF saved to your Download folder!');
    } else {
      // iOS: open share dialog
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save or Share PDF',
          UTI: 'com.adobe.pdf',
        });
      } else {
        alert('Sharing not available on this device');
      }
    }
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    alert(`Failed to generate PDF: ${error}`);
  }
}
