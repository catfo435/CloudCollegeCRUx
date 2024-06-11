import { Button, Modal, TextInput } from "flowbite-react";
import { ChangeEvent, useState } from "react";
export function ViewWallet({openModal, setOpenModal, wallet, addBalance} : {openModal : boolean, setOpenModal : Function , wallet : string, addBalance : Function}) {

  const [loading,setLoading] = useState(false)
  const [incrBal ,setIncrBal] = useState("0")

  function onCloseModal() {
    setOpenModal(false);
  }

  return (
    <>
      <Modal show={openModal} size="sm" onClose={onCloseModal} popup>
        <Modal.Header>
        <h3 className="ml-4 mt-2 text-4xl font-medium text-gray-900">Wallet</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
              <div className="my-2 flex">
                <div className="flex justify-center items-center text-2xl">Balance</div>
                <div className="flex justify-end items-center grow text-lg">{wallet} Credits</div>
              </div>
              <div className="flex justify-center items-center">
                <div className="flex justify-center w-36 items-center"><TextInput size={3} value={incrBal} onChange={(e : ChangeEvent<HTMLInputElement>) => {setIncrBal(e.target.value)}}></TextInput></div>
                <Button isProcessing={loading} onClick={() => {
                  setLoading(false)
                  addBalance(incrBal)
                  setLoading(true)
                  }} color="blue">Add Balance</Button>
              </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
