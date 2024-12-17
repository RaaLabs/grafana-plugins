import React, { useState } from "react";
import { MyVariableQuery } from "./types";

// import { QueryEditorProps } from "@grafana/data";

// import { AssetsQuery, DataSource, DataSourceOptions } from "./datasource";

interface VariableQueryProps {
    query: MyVariableQuery;
    onChange: (query: MyVariableQuery, definition: string) => void;
}

// type Props = QueryEditorProps<DataSource, AssetsQuery, DataSourceOptions>;

export const VariableQueryEditor = ({ onChange, query }: VariableQueryProps) => {
  const [state, setState] = useState(query);

  const saveQuery = () => {
    onChange(state, `${state.rawQuery} (${state.field})`);
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) =>
    setState({
      ...state,
      [event.currentTarget.name]: event.currentTarget.value,
    });

  return (
    <>
      <div className="gf-form">
        <span className="gf-form-label width-10">Query</span>
        <input
          name="rawQuery"
          className="gf-form-input"
          onBlur={saveQuery}
          onChange={handleChange}
          value={state.rawQuery}
        />
      </div>
      <div className="gf-form">
        <span className="gf-form-label width-10">Field</span>
        <input
          name="field"
          className="gf-form-input"
          onBlur={saveQuery}
          onChange={handleChange}
          value={state.field}
        />
      </div>
    </>
  );
};
