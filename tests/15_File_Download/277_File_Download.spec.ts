import { test, expect} from '@playwright/test';
import path from 'path';

test.describe('File Downalod Code',() =>{

    test.beforeEach(async({page}) => {
        await page.goto('https://app.thetestingacademy.com/playwright/widgets/upload-download');
    });


    test("Verify the download button is working, we are able to save the file.", async ({ page}) => {


        // Event happned, we need to capture, similar to the JS Alert. 
        // page.on('')
        
        const [staticDowload] = await Promise.all([
            page.waitForEvent('download'),
            page.getByTestId('download-static').click()
        ]);
        
        const filePath = path.join('out', staticDowload.suggestedFilename());
        await staticDowload.saveAs(filePath);
      


    });

});