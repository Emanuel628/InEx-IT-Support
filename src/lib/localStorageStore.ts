type ValidationFn<T> = (value: unknown) => value is T;

type LocalStoreOptions<T> = {
  storageKey: string;
  fallbackValue: T;
  schemaVersionKey?: string;
  schemaVersionValue?: string;
  validate?: ValidationFn<T>;
};

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function writeSchemaVersion(schemaVersionKey: string | undefined, schemaVersionValue: string | undefined) {
  if (!canUseStorage() || !schemaVersionKey || !schemaVersionValue) {
    return;
  }

  window.localStorage.setItem(schemaVersionKey, schemaVersionValue);
}

export function readLocalStore<T>({
  storageKey,
  fallbackValue,
  schemaVersionKey,
  schemaVersionValue,
  validate,
}: LocalStoreOptions<T>): T {
  if (!canUseStorage()) {
    return fallbackValue;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);

    if (!raw) {
      window.localStorage.setItem(storageKey, JSON.stringify(fallbackValue));
      writeSchemaVersion(schemaVersionKey, schemaVersionValue);
      return fallbackValue;
    }

    const parsed = JSON.parse(raw) as unknown;

    if (validate && !validate(parsed)) {
      window.localStorage.setItem(storageKey, JSON.stringify(fallbackValue));
      writeSchemaVersion(schemaVersionKey, schemaVersionValue);
      return fallbackValue;
    }

    writeSchemaVersion(schemaVersionKey, schemaVersionValue);
    return parsed as T;
  } catch {
    window.localStorage.setItem(storageKey, JSON.stringify(fallbackValue));
    writeSchemaVersion(schemaVersionKey, schemaVersionValue);
    return fallbackValue;
  }
}

export function writeLocalStore<T>(storageKey: string, value: T) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

export function clearLocalStore(storageKey: string) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(storageKey);
}
