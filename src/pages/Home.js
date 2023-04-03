import { useState, useEffect } from "react";
import Papa from "papaparse";

import Header from "../components/Header";
import TemplateMapper from "../components/TemplateMapper";
import Layout from "../components/Layout";
import { generateAndSend, getZip, downloadLogFile, downloadErrorFile } from "../utils/api";
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
  const [defaultTemplate, setDefaultTemplate] = useState('');
  const [info, setInfo] = useState('');
  const [isSending, setIsSending] = useState(false);

  const resetForm = () => {
    setCSVFile(null);
    setEmailProvider(null);
    setPurposes([]);
    setNumRecordRead(null);
    setNumSuccess(null);
    setNumFailures(null);
    setError('');
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

  const handleGenerateAndSend = () => {
    setIsSending(true);
    if (csvData.length <= 0) {
      setError("Please add some data in CSV File before sending receipts!");
    }

    if (templateMapping.length <= 0 && defaultTemplate == '') {
      setError("Please specify atleast one generic email template!");
    }

    generateAndSend(csvData, templateMapping).then((e) => {
      if (e.error) {
        console.log(e);
        setError("An error occurred while emailing receipts. Check logs");
      } else {
        setInfo("All email receipts sent!");
      }

      setIsSending(false);
    })
  };


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


  return (
    <>
      <Header user={user} />
      <Layout>
        <div>
          <p class="fw-bold fs-4">E-receipt generation and sender app</p>
        </div>

        <div>
          {error !== '' &&
            <div className="alert alert-danger alert-dismissible fade show" role="alert">{error}
              <button type="button" onClick={() => setError('')} class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          }
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

        <div>
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
        </div>


        <div className="py-3">
          {isSending && <div className="spinner-border p-2" role="status"><span class="visually-hidden">Loading...</span></div>}
          {info !== '' &&
            <div className="alert alert-info alert-dismissible fade show" role="alert">{info}
              <button type="button" onClick={() => setInfo('')} class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          }
        </div>

        <div class="my-3 text-center">
          <button
            class="w-100 btn btn-primary"
            onClick={() => handleGenerateAndSend()}
          >
            Generate and Send
          </button>
        </div>

        <div class="row justify-contet-between">
          <div class="col">
            <button class="btn btn-outline-secondary" onClick={() => downloadZip()}>Download receipts</button>
          </div>
          <div class="col">
            <button class="btn btn-outline-secondary" onClick={() => downloadError()}>
              Download error file
            </button>
          </div>
          <div class="col">
            <button class="btn btn-outline-secondary" onClick={() => downloadLog()}>Download log file</button>
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
