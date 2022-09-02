import type {
  CollectionResourceRelationship,
  Links,
  Meta,
  PaginationLinks,
} from '@ember-data/types/q/ember-data-json-api';
import type { StableRecordIdentifier } from '@ember-data/types/q/identifier';

import type { UpgradedMeta } from '../-edge-definition';
import type { RelationshipState } from '../-state';
import { createState } from '../-state';

export interface CollectionRelationship {
  definition: UpgradedMeta;
  identifier: StableRecordIdentifier;
  state: RelationshipState;

  localMembers: Set<StableRecordIdentifier>;
  remoteMembers: Set<StableRecordIdentifier>;
  localState: StableRecordIdentifier[];
  remoteState: StableRecordIdentifier[];

  meta: Meta | null;
  links: Links | PaginationLinks | null;
  transactionRef: number;
}

export function createCollectionRelationship(
  definition: UpgradedMeta,
  identifier: StableRecordIdentifier
): CollectionRelationship {
  return {
    definition,
    identifier,
    state: createState(),
    localMembers: new Set(),
    remoteMembers: new Set(),
    localState: [],
    remoteState: [],

    meta: null,
    links: null,
    transactionRef: 0,
  };
}

export function legacyGetCollectionRelationshipData(source: CollectionRelationship): CollectionResourceRelationship {
  let payload: CollectionResourceRelationship = {};
  if (source.state.hasReceivedData) {
    payload.data = source.localState.slice();
  }
  if (source.links) {
    payload.links = source.links;
  }
  if (source.meta) {
    payload.meta = source.meta;
  }

  return payload;
}