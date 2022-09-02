import { assert } from '@ember/debug';

import type { StableRecordIdentifier } from '@ember-data/types/q/identifier';

import type { RemoveFromRelatedRecordsOperation } from '../-operations';
import { isHasMany, notifyChange } from '../-utils';
import type { CollectionRelationship } from '../edges/collection';
import type { Graph } from '../graph';
import { removeFromInverse } from './replace-related-records';

export default function removeFromRelatedRecords(
  graph: Graph,
  op: RemoveFromRelatedRecordsOperation,
  isRemote: boolean
) {
  const { record, value } = op;
  const relationship = graph.get(record, op.field);
  assert(
    `You can only '${op.op}' on a hasMany relationship. ${record.type}.${op.field} is a ${relationship.definition.kind}`,
    isHasMany(relationship)
  );
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      removeRelatedRecord(graph, relationship, record, value[i], isRemote);
    }
  } else {
    removeRelatedRecord(graph, relationship, record, value, isRemote);
  }
  notifyChange(graph, relationship.identifier, relationship.definition.key);
}

function removeRelatedRecord(
  graph: Graph,
  relationship: CollectionRelationship,
  record: StableRecordIdentifier,
  value: StableRecordIdentifier,
  isRemote: boolean
) {
  assert(`expected an identifier to add to the relationship`, value);
  const { localMembers, localState } = relationship;

  if (!localMembers.has(value)) {
    return;
  }

  localMembers.delete(value);
  let index = localState.indexOf(value);

  assert(`expected localMembers and localState to be in sync`, index !== -1);
  localState.splice(index, 1);

  removeFromInverse(graph, value, relationship.definition.inverseKey, record, isRemote);
}
