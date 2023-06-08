function replacetemp(values, template) {
  return template.replace(/\{\{%(\w+)%\}\}/g, (_match, key) => values[key].toString());
}

export default replacetemp;
