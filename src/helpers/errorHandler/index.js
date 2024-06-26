export const errorHandler = ({ error, toast = null, setFormData = null, formData = null, setErrorMessage = null }) => {
    if (error.response) {
        if (setFormData && formData && typeof error.response.data.error === "object") {
            setFormData({
                ...formData,
                errors: error.response.data.error
            });
            if (setErrorMessage) {
                setErrorMessage(error.response.data.message);
            }
            if (toast) {
                toast.error(error.response.data.message);
            }
        }
        else if (setErrorMessage) {
            setErrorMessage(error.response.data.message);
            // setErrorMessage("internal server error!");
        }
        else if (toast) {
            // toast.error("internal server error!");
            toast.error(error.response.data.message);
        }
    } else if (error.isAxiosError && setErrorMessage && toast) {
        setErrorMessage("network error. try again later!");
        toast.error("network error. try again later!");
    }
    else if (error.isAxiosError && setErrorMessage) {
        setErrorMessage("network error. try again later!");
    }
    else if (setErrorMessage && toast) {
        setErrorMessage("unexpected error. try again later!");
        toast.error("unexpected error. try again later!");
    }
}