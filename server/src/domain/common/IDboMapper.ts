import { Dbo } from './Dbo';

interface IDboMapper<T> {

  toDbo(model: T): Dbo;

  fromDbo(dbo: Dbo): T;

}


export {
  IDboMapper,
};
