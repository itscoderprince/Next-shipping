import useFetch from "@/hooks/useFetch";
import React from "react";

const EditMedia = ({ params }) => {
  const { id } = use(params);
  const { data: response } = useFetch(`/api/media/get`);
  console.log(data);

  return <h1>Edit media page</h1>;
};

export default EditMedia;
