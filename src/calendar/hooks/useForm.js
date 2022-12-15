import { useMemo, useState } from "react";
import { differenceInSeconds } from "date-fns";
import Swal from "sweetalert2";
import { useCalendarStore, useUiStore } from "../../hooks";

export const useForm = (initialForm) => {
  const [formSumitted, setFormSumitted] = useState(false);
  const [formValues, setFormValues] = useState(initialForm);
  const { closeDateModal } = useUiStore();
  const { startSavingEvent } = useCalendarStore();

  const titleClass = useMemo(() => {
    if (!formSumitted) return "";

    return formValues.title.length > 0 ? "" : "is-invalid";
  }, [formValues.title, formSumitted]);

  const onInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };
  const onDateChange = (date, changing) => {
    setFormValues({
      ...formValues,
      [changing]: date,
    });
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSumitted(true);

    const difference = differenceInSeconds(formValues.end, formValues.start);

    if (isNaN(difference) || difference <= 0) {
      console.log("Error en las fechas");
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "error",
        title: "Fechas Incorrectas.",
        text: "Revisar las fechas ingresadas.",
      });

      return;
    }

    if (formValues.title.length <= 0) return;

    await startSavingEvent(formValues);
    closeDateModal();
    setFormSumitted(false);
  };

  return {
    formValues,
    ...formValues,
    setFormValues,
    onSubmit,
    titleClass,
    onInputChange,
    onDateChange,
  };
};
