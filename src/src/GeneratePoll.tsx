import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import "./GeneratePoll.css"
import { ethers } from 'ethers';

export default function GeneratePoll() {
  interface FormValues {
    question: string;
    des: string;
    gdes: string;
    id: string;
    pkcsv: string;
    pks: string[];
  }
  const [pks, setPks] = useState<string[]>([]);

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files && event.target.files[0];
//     console.log(file)
//     if (!file) {
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       if (e.target && e.target.result) {
//         const contents = e.target.result;
//         if (typeof contents == 'string') {
//           const rows = contents.split('\n');
//           const values = rows.map((row) => row.split(','));
//           setPks(values.flat());
//         }
//       }
//     };
//     reader.readAsText(file);
//   };

    // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files && event.target.files[0];
    //     // const reader = new FileReader();

    //     console.log(file)
    // }

  return (
    <div>
      <div className="generate-poll-container">
      <h1>Generate a Poll</h1>
      <Formik
        initialValues={{ question: '', des: '', gdes: '', id: '', pkcsv: '', pks: [] }}
        onSubmit={(values, { setSubmitting }) => {
          let proposedpks : string[] = [];
          const split = values.pkcsv.split(',');
          if (split) {
            for (let i = 0; i < split.length; i++) {
              if (ethers.utils.isAddress(split[i])) {
                console.log('true')
                proposedpks.push(split[i]);
              }
            }
          }
          setPks(proposedpks)
          console.log(pks)
            // setPks(values.pkcsv.split(','))
          console.log(values)
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="question" name="question" placeholder="Question" />
            <Field type="des" name="des" placeholder="Vote Description" />
            <Field type="gdes" name="gdes" placeholder="Group Description" />
            <Field type="id" name="id" placeholder="Private Key" />
            <Field
              type="pkcsv"
              name="pkcsv"
              placeholder="Input Voter Addresses"
            />
            <p>or enter CSV of addresses:</p>

            {/* <Field
              type="file"
              name="avatar"
              onChange={(event) => setFieldValue('pks', event.currentTarget.files![0])};
            /> */}

            <input type="file"/>

              {/* <input id="file" name="file" type="file" onChange={(event) => {
                setFieldValue("pks", event.currentTarget.files![0]);
              }} /> */}

            {/* <Field type="file"/> */}
            {/* <input
                type="file"
                name="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                style={{ display: "block", margin: "10px auto" }}
            />        */}
            <button type="submit" disabled={isSubmitting} className="button-35"><div className="gradient-text">Create</div></button>

          </Form>
        )}
      </Formik>
    </div>
    </div>
  );
}



// TODO: verify ethereum validity address in real time, connectwallet