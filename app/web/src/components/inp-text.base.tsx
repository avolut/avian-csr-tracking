base(
  {
    meta: {},
    init: ({ meta, params, children }) => {},
  },
  ({ meta, children }) => (
    <div
      class={`flex self-stretch flex-col space-y-2.5 items-start justify-start w-full ${props.className}`}
      style={css`
        ${props.style}
      `}
    >
      {props.label && (
        <inp-label label={props.label} isRequired={props.isRequired} />
      )}
      <TextField
        class={`flex self-stretch flex-col items-start justify-center bg-gray-100 w-full ${props.className}`}
        style={css`
          ${props.style}
        `}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        borderless={true}
        type={props.type}
        multiline={props.multiline}
        defaultValue={props.defaultValue}
        rows={props.rows}
        styles={Object.assign(
          {
            wrapper: {
              width: "100%",
            },
          },
          props.styles
        )}
      />
      {props.errors && <err-messages errors={props.errors} />}
    </div>
  )
);
