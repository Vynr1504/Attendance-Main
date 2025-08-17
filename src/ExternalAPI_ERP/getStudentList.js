import axios from 'axios';
import https from 'https';

// TODO: Define the actual API URL
const url =  'https://erpapi.manit.ac.in/extra-api/student_section_data';

// Create HTTP agent with SSL verification disabled
const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

export const getStudentList = async (subjectCode) => {
    try {
        let response = await axios.post(url, {
            "regsession": 2025, "regtypeIdcode": 2, "key": "MMMMMAAAAAAATTTTTTTT", "subjectCode": `${subjectCode}`
        }, {
            httpsAgent: httpsAgent
        })
       return response.data;
    } catch (error) {
      console.log(`Error while Fetching the Details of the Students for the Subject Code  ${subjectCode} : ${error.message}`);
      return []; // Return empty array on error
    }
}