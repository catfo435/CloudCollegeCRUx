import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
export function AddCourseModal({openModal, setOpenModal, handleSubmit} : {openModal : boolean, setOpenModal : Function , handleSubmit : Function}) {


  const [name,setName] = useState('')
  const [courseId,setCourseId] = useState('')
  const [price,setPrice] = useState("0")
  const [loading,setLoading] = useState(false)

  function onCloseModal() {
    setOpenModal(false);
    setName('')
    setCourseId('')
  }

  const handleAddCourse = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/courses`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name,courseId,price,instructors:[window.localStorage.getItem("userId")],email:window.localStorage.getItem("userEmail")})
      })

      if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok');
      }

      setOpenModal(false)
      handleSubmit()
    } catch (err) {
      console.error(err)
      alert('Failed to add content. Please try again.');
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Modal show={openModal} size="3xl" onClose={onCloseModal} popup>
        <Modal.Header>
        <h3 className="ml-4 mt-2 text-2xl font-medium text-gray-900">Add Course</h3>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
            <div className="mb-2 block">
                <Label htmlFor="id" value="Course ID" />
              </div>
              <TextInput id="id" value={courseId} onChange={(e) => {setCourseId(e.target.value)}} required />
              <div className="mb-2 block">
                <Label htmlFor="price" value="Price" />
              </div>
              <TextInput id="price" value={price} onChange={(e) => {setPrice(e.target.value)}} required />
            </div>
            <div className="flex justify-center w-full">
              <Button isProcessing={loading} onClick={handleAddCourse} color="blue" >Add Course</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
