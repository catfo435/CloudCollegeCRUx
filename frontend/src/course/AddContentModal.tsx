import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import { DropFile } from "./DropFile";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export function AddContentModal({openModal, setOpenModal, handleSubmit, courseId} : {openModal : boolean, setOpenModal : Function , handleSubmit : Function, courseId : string}) {
  const [heading,setHeading] = useState('')
  const [desc,setDesc] = useState('')
  const [file,setFile] = useState<File>()
  
  const [loading,setLoading] = useState(false)

  function onCloseModal() {
    setHeading('')
    setDesc('')
    setFile(undefined)
    setOpenModal(false);
  }

  const handleAddContent = async () => {
    setLoading(true)
    try {

      const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG)
      initializeApp(firebaseConfig)

      const storage = getStorage()
      let fileURL = ""

      if (file) {
        const fileRef = ref(storage, `${courseId}/${file.name}`)
        fileURL = await getDownloadURL((await uploadBytes(fileRef, file)).ref)
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/${courseId}/addContent`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({heading,description:desc,file:file?fileURL:null})
      })

      if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok');
      }

      setHeading('')
      setDesc('')
      setFile(undefined)

      setOpenModal(false)
      handleSubmit()
    } catch (err) {
      console.error(err)
      alert('Failed to add content. Please try again.');
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <>
      <Modal show={openModal} size="3xl" onClose={onCloseModal} popup>
        <Modal.Header>
        <h3 className="ml-4 mt-2 text-2xl font-medium text-gray-900">Add Content</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="Heading" value="Heading" />
              </div>
              <TextInput
                id="heading"
                placeholder="Please enter a heading"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="desc" value="Description" />
              </div>
              <TextInput id="desc" value={desc} onChange={(e) => {setDesc(e.target.value)}} required />
            </div>
            <Label value="Choose A File" />
            <div>{file?file.name:""}</div>
            <DropFile handleFileUpload={(e : any) => {setFile(e.target.files[0])}}/>
            <div className="flex justify-center w-full">
              <Button isProcessing={loading} onClick={handleAddContent} color="blue" >Add Content</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
