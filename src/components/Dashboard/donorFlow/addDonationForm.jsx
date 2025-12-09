const AddDonationForm = ({donorDetails}) => {
    return <><h1>Donation Details</h1> 
    <h3>You are creating a donation for the user <b>{donorDetails?.firstName}</b></h3>
    // create a form with the following fields
    1) Donation method : Online, Cheque, Cash, RTGS
    2) Reference number (only for the case other than cash)
    3) Amount
    4) Date field (if back date is allowed)
    5) Bacnk name (select: SBI, HDFC, ICICI, AXIS, PNB, BOI, BOB, Other)
    </>
}
export default AddDonationForm
