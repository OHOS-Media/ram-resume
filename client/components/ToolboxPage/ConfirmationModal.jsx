import Button from "../ui/Button";

export default function ConfirmationModal({
  setConfirmationModalActive,
  handleDone,
  resetInitiated,
  handleFormReset,
  handleCancel,
}) {
  const handleClose = () => {
    setConfirmationModalActive(false);
  };

  return (
    <div className="fixed flex justify-center items-center inset-0 bg-black/50 z-50 w-screen h-screen overflow-hidden overscroll-none">
      <div className={"absolute justify-center z-50 animate-fadeIn"}>
        <div className="bg-fordham-white shadow-lg rounded-[16px] p-6 w-fit">
          <div className="flex flex-col items-start gap-6 w-full">
            <div className="flex flex-col gap-2">
              <h3 className="text-fordham-black body-txt-md font-medium">
                Do you want to proceed?
              </h3>
              <p className="text-fordham-dark-gray body-txt-sm">
                If you continue, any unsaved changes will be lost.
              </p>
            </div>

            <div className="flex justify-between w-full">
              <Button
                text={"Yes"}
                variant="tertiary"
                className="text-error-state"
                onClick={resetInitiated ? handleFormReset : handleDone}
              />
              <Button
                text={"Cancel"}
                variant="tertiary"
                onClick={resetInitiated ? handleClose : handleCancel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
