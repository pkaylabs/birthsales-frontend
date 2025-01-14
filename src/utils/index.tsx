/* eslint-disable @typescript-eslint/no-unused-vars */
import { Action } from '@/components/buttons/action-button';
import { LocationGenerics } from '@/router/location';

import _ from 'lodash';
import { BuildNextOptions } from 'react-location';

export { default as classNames } from './classnames';
export { default as wrapClick } from './wrap-click';
export { default as wrapImage } from './wrap-image';

export const dispatchAction =
  (
    id: string,
    action: Exclude<Action, 'expand' | 'goto' | 'clone'>,
    navigate: (args_0: BuildNextOptions<LocationGenerics>) => void
  ) =>
  () => {
    navigate({
      search: (old) => ({
        ...old,
        id,
        modal: action,
      }),
    });
  };
export const naviagteTo =
  (
    id: string,
    navigate: (args_0: BuildNextOptions<LocationGenerics>) => void,
    type: 'sub' | 'parent',
    search?: Partial<LocationGenerics>
  ) =>
  () => {
    navigate({
      to: type == 'parent' ? `/${id}` : `./${id}`,
      search: (old) => ({
        ...old,
        ...search,
      }),
    });
  };
