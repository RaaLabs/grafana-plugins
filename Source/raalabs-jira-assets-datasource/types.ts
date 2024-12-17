export type ObjectListInclTypeAttributesEntryResult = {
    startAt: number;
    maxResults: number;
    total: number;
    values: AssetObject[];
    objectTypeAttributes: ObjectTypeAttribute[];
    last: boolean;
    isLast: boolean;
}

export type AssetObject = {
    workspaceId: string;
    globalId: string;
    id: string;
    label: string;
    objectKey: string;
    avatar: Avatar;
    objectType: ObjectType;
    created: string;
    updated: string;
    hasAvatar: boolean;
    timestamp: number;
    attributes: ObjectAttribute[];
    _links: object;
};

export type Avatar = {
    workspaceId: string;
    globalId: string;
    id: string;
    avatarUUID: string;
    url16: string;
    url48: string;
    url72: string;
    url144: string;
    url288: string;
    objectId: string;
};

export type ObjectType = {
    workspaceId: string;
    globalId: string;
    id: string;
    name: string;
    description: string;
    icon: Icon;
    position: number;
    created: string;
    updated: string;
    objectCount: number;
    parentObjectTypeId: number;
    type: number;
    objectSchemaId: string;
    inherited: boolean;
    abstractObjectType: boolean;
    parentObjectTypeInherited: boolean;
};

export type Icon = {
    id: string;
    name: string;
    url16: string;
    url48: string;
};

export type ObjectAttribute = {
    workspaceId: string;
    objectTypeAttribute: ObjectTypeAttribute;
    objectTypeAttributeId: string;
    objectAttributeValues: ObjectAttributeValue[];
};

export type ObjectTypeAttribute = {
    workspaceId: string;
    globalId: string;
    id: string;
    objectType: ObjectType;
    name: string;
    label: boolean;
    type: number;
    description: string;
    defaultType: DefaultType;
    typeValue: string;
    typeValueMulti: string[];
    additionalValue: string;
    referenceType: ReferenceType;
    referenceObjectTypeId: string;
    referenceObjectType: ObjectType;
    editable: boolean;
    system: boolean;
    indexed: boolean;
    sortable: boolean;
    summable: boolean;
    minimumCardinality: number;
    maximumCardinality: number;
    suffix: string;
    removable: boolean;
    objectAttributeExists: boolean;
    hidden: boolean;
    includeChildObjectTypes: boolean;
    uniqueAttribute: boolean;
    regexValidation: string;
    qlQuery: string;
    options: string;
    position: number;
};

export type DefaultType = {
    id: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
    name: string;
};

export type ReferenceType = {
    workspaceId: string;
    globalId: string;
    id: string;
    name: string;
    description: string;
    color: string;
    url16: string;
    removable: boolean;
    objectSchemaIm: string;
};

export type ObjectAttributeValue = {
    value: string;
    displayValue: string;
    searchValue: string;
    referencedObject: object;
    user: User;
    group: Group;
    status: Status;
    additionalValue: string;
};

export type User = {
    avatarUrl: string;
    displayName: string;
    name: string;
    key: string;
    emailAddress: string;
    html: string;
    renderedLink: string;
    isDeleted: boolean;
    lastSeenVersion: string;
    self: string;
}

export type Group = {
    avatarUrl: string;
    name: string;
};

export type Status = {
    id: string;
    name: string;
    description: string;
    category: number;
    objectSchemaId: string;
};

export type MyVariableQuery = {
    rawQuery: string;
    field: string;
};
