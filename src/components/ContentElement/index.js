import parser from '../../modules/parser';

export default function (props) {
  return parser `
    <${props.data.type} key=${props.key}>${props.data.content}</${props.data.type}>
  `;
}