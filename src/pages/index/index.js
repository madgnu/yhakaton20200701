import render from '../../modules/render';
import parser from '../../modules/parser';

import Content from '../../components/Content';

import defaultPage from '../../data/default';

render(parser `<${Content} page=${defaultPage}/>`, document.querySelector('body'));