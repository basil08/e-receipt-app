import { useState, useEffect } from "react";
import Papa from "papaparse";

import Header from "../components/Header";
import TemplateMapper from "../components/TemplateMapper";
import Layout from "../components/Layout";
import { generateReceipts, sendReceipts, getZip, downloadLogFile, clearCache, downloadErrorFile } from "../utils/api";
import loginGuard from "../utils/loginguard";
import { useNavigate } from "react-router-dom";

export default function Home() {
  useEffect(loginGuard(useNavigate()), []);

  const emailMap = {
    0: null,
    1: "smtp",
    2: "mailchimp",
    3: "sendgrid",
  };

  const [csvFile, setCSVFile] = useState(null);
  const [emailProvider, setEmailProvider] = useState(null);
  const [purposes, setPurposes] = useState([]);
  const [numRecordRead, setNumRecordRead] = useState(null);
  const [numSuccess, setNumSuccess] = useState(null);
  const [numFailures, setNumFailures] = useState(null);
  const [user, setUser] = useState(null);
  const [csvData, setCSVData] = useState([]);
  const [error, setError] = useState('');
  const [templateMapping, setTemplateMapping] = useState([]);
  const [defaultTemplate, setDefaultTemplate] = useState('6430fc87853aebef96055aad');
  const [info, setInfo] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [csvValidated, setCSVVaildated] = useState(false);
  const [receiptsGenerated, setReceiptsGenerated] = useState(false);
  const [emailsSent, setEmailsSent] = useState(false);

  const [csvErrors, setCSVErrors] = useState([]);

  const resetForm = () => {
    setCSVFile(null);
    setEmailProvider(null);
    setPurposes([]);
    setNumRecordRead(null);
    setNumSuccess(null);
    setNumFailures(null);
    setError('');
    setCSVErrors([]);
    setCSVVaildated(false);
    setReceiptsGenerated(false);
    setEmailsSent(false);
  };

  const downloadZip = async () => {
    const res = await getZip();
    const raw = await res.arrayBuffer();
    const bytes = new Uint8Array(raw);
    let blob = new Blob([bytes], { type: "application/zip" });// change resultByte to bytes
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = "FILE.zip";
    link.click()
  }

  const downloadLog = async () => {
    const res = await downloadLogFile();
    const raw = await res.text();
    console.log(raw);
    // const bytes = new Uint8Array(raw);
    // let blob=new Blob(raw, {type: "text/plain"});// change resultByte to bytes
    var link = document.createElement('a');
    document.body.appendChild(link);
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(raw));
    link.setAttribute('download', 'log.txt');
    // link.download="log.txt";
    link.click();
    document.body.removeChild(link);
  }

  const downloadError = async () => {
    const res = await downloadErrorFile();
    const raw = await res.text();
    console.log(raw);
    var link = document.createElement('a');
    document.body.appendChild(link);

    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(raw));
    link.setAttribute('download', 'error.txt');
    link.click();
    document.body.removeChild(link);
  }

  const handleDefaultTemplateChange = (e) => {
    setDefaultTemplate(e);
  }

  // TODO: 
  const handleTemplateMappingChange = (p, e) => {
    // edit the array of templateMapping
    const newMapping = templateMapping.slice();
    const val = newMapping.find((m) => m.purpose === p)
    if (val) {
      newMapping.splice(val, 1);
    }
    newMapping.push({ purpose: p, templateId: e });
    setTemplateMapping(newMapping);
  }

  const handleGenerate = () => {
    if (csvData.length <= 0) {
      setError("Please add some data in CSV File before sending receipts!");
      return;
    }

    if (csvErrors.length > 0) {
      setError("Please correct all errors in CSV before sending receipts!");
      return;
    }

    setIsSending(true);

    generateReceipts(csvData).then((e) => {
      if (e.error) {
        console.log(e);
        setError("An error occurred while generating receipts. Check logs");
      } else {
        setInfo("Receipts generated. Proceed to sending emails now!");
        setReceiptsGenerated(true);
      }
      setIsSending(false);
    })
  };

  const handleSend = () => {
    if (templateMapping.length <= 0 && (defaultTemplate === "None" || defaultTemplate === "")) {
      setError("Please specify atleast one generic email template!");
      return;
    }

    if (csvErrors.length > 0) {
      setError("Please correct all errors in CSV before sending receipts!");
      return;
    }

    setInfo("");
    setError("");
    setIsSending(true);
    sendReceipts(csvData, defaultTemplate).then((e) => {
      if (e.error) {
        console.log(e);
        if (e.code === -1) {
          setError(e.message);
        } else {
          setError("An error occurred while generating receipts. Check logs");
        }
      } else {
        setInfo("All email receipts sent!");
        setEmailsSent(true);
      }
      setIsSending(false);
    })
  }



  const computeTemplateMapping = () => {
    console.log("computing!!");
    console.log(templateMapping);
  }

  const handleFileInputChange = (e) => {

    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log(results.data);
        setCSVData(results.data);
        const purposes = [];
        results.data.map((d) => {
          if (d.PURPOSE && !purposes.includes(d.PURPOSE)) {
            purposes.push(d.PURPOSE);
          }
        });
        setPurposes(purposes);
        setCSVFile(e.target.files[0]);
      },
    });
  };

  const handleEmailProviderChange = (e) => {
    setEmailProvider(emailMap[e.target.value]);
  };

  const getErrors = (csvData) => {
    // console.log(csvData);
    const errors = [];

    csvData.map((record, index) => {
      if (record['EMAIL'] && !isValidEmail(record['EMAIL'])) {
        errors.push({ line: index + 1, errText: "Email not valid" })
      }

      // TODO: should it be exact 10?
      if (record['PHONE'] && !isValidPhoneNumber(record['PHONE'])) {
        errors.push({ line: index + 1, errText: 'Mobile number is less than 10 digits' })
      }

      if (record['ID_TYPE'] && record['ID_TYPE'] === 'PAN') {
        if (record['ID'] && !isValidPan(record['ID'])) {
          errors.push({ line: index + 1, errText: 'Pan number doesn\'t match pattern: alphabets<5> number <4> alphabet<1>' });
        }
      }
    });

    return errors;
  }

  const isValidPhoneNumber = (phone) => {
    return String(phone).length == 10;
  }

  const isValidEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const isValidPan = (pan) => {
    return String(pan)
      .match(
        /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/
      );
  };

  const handleClearCache = () => {
    clearCache().then((e) => {
      if (e.error) {
        setError(e.message);
      }
      setInfo(`Files cleared: ${e.message}`);
    })
  }

  const handleValidateCSV = () => {
    const errors = getErrors(csvData);
    setCSVErrors(errors);

    if (errors.length <= 0) {
      setCSVVaildated(true);
    } else {
      setCSVVaildated(false);
    }
  }

  return (
    <>
      <Header user={user} />
      <Layout>
        <div>
          <p class="fw-bold fs-4">E-receipt generation and sender app</p>
        </div>


        <div class="my-3">
          <label for="csvFile" class="form-label">
            Input file receipt CSV
          </label>
          <input
            class="form-control"
            type="file"
            id="csvFile"
            accept=".csv"
            onChange={(r) => handleFileInputChange(r)}
          />
        </div>

        <div class="my-3">
          <label for="email-provider-select">Select Email provider</label>
          <select
            class="form-select"
            id="email-provider-select"
            aria-label="Default select example"
            onChange={(e) => handleEmailProviderChange(e)}
          >
            <option value="0" selected>
              Select email provider (Default: Google SMTP)
            </option>
            <option value="1">Google SMTP</option>
            <option value="2">MailChimp (Not configured)
            </option>
            <option value="3">SendGrid (Not configured)</option>
          </select>
        </div>



        <div class="my-3">
          {csvFile && <TemplateMapper purposes={purposes} computeTemplateMapping={computeTemplateMapping} handleDefaultTemplateChange={handleDefaultTemplateChange} handleTemplateMappingChange={handleTemplateMappingChange} />}
        </div>

        {/* <div>status bar placeholder</div> */}

        {/* <div>
          <div>Status Box</div>
          <div class="border border-1 border-darkblack rounded p-2 bg-white">
            {numRecordRead && <p>Total records read: {numRecordRead}</p>}
            <p class="row justify-content-between">
              <div class="col">
                {numSuccess && (
                  <span class="text-green fw-bold">
                    Success: {numSuccess}/{numRecordRead}
                  </span>
                )}
              </div>
              <div class="col text-end">
                {numFailures && (
                  <span class="text-red fw-bold">
                    Failures: {numFailures}/{numRecordRead}
                  </span>
                )}
              </div>
            </p>
          </div>
        </div> */}


        <div className="py-3">
          {isSending && <div className="spinner-border p-2" role="status"><span class="visually-hidden">Loading...</span></div>}
          {info !== '' &&
            <div className="alert alert-info alert-dismissible fade show" role="alert">{info}
              <button type="button" onClick={() => setInfo('')} class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          }
          <div>
            {error !== '' &&
              <div className="alert alert-danger alert-dismissible fade show" role="alert">{error}
                <button type="button" onClick={() => setError('')} class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            }
          </div>
        </div>

        <div class="my-3 text-center">
          <button
            class={`w-100 btn btn-primary`}
            onClick={() => handleClearCache()}
          >
            Clear Cache
          </button>
        </div>

        <div class="my-3 text-center">
          <button
            class={`w-100 btn btn-primary ${!csvFile ? 'disabled' : ''}`}
            onClick={() => handleValidateCSV()}
          >
            Validate CSV
          </button>
        </div>

        <div className="my-3 text-center">
          {(csvErrors && csvErrors.length > 0) &&
            <div className="card border">
              <div className="text-red fw-bold">Errors</div>
              <ol>
                {csvErrors.map((error, index) => {
                  return <li key={index} className="text-red"><strong>
                    Row number {error.line}
                  </strong>: {error.errText}</li>
                })}
              </ol>
            </div>
          }
        </div>

        <div class="my-3 text-center">
          <button
            class={`w-100 btn btn-primary ${!csvValidated ? 'disabled' : ''}`}
            onClick={() => handleGenerate()}
          >
            Generate Receipts
          </button>
        </div>

        <div class="my-3 text-center">
          <button
            class={`w-100 btn btn-primary ${(!csvValidated || !receiptsGenerated) ? 'disabled' : ''}`}
            onClick={() => handleSend()}
          >
            Send Receipts
          </button>
        </div>

        <div class="row justify-content-between">
          <div class="col">
            <button className={`btn btn-outline-secondary ${(!csvValidated | !receiptsGenerated || !emailsSent) ? 'disabled' : ''}`} onClick={() => downloadZip()}>Download receipts</button>
          </div>
          <div class="col">
            <button className={`btn btn-outline-secondary ${!csvValidated | !receiptsGenerated || !emailsSent ? 'disabled' : ''}`} onClick={() => downloadError()}>
              Download error file
            </button>
          </div>
          <div class="col">
            <button className={`btn btn-outline-secondary ${!csvValidated | !receiptsGenerated || !emailsSent ? 'disabled' : ''}`} onClick={() => downloadLog()}>Download log file</button>
          </div>
        </div>

        <div class="row my-3 text-end">
          <div class="col">
            <button class="btn btn-secondary" onClick={() => resetForm()}>
              Reset
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
}
