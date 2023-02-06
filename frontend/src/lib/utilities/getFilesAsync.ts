export async function getFilesAsync(data: DataTransferItemList) {
	const files = [];
	for (let i = 0; i < data.length; i++) {
		const item = data[i];
		if (item.kind === 'file') {
			if (typeof item.webkitGetAsEntry === 'function') {
				const entry: FileSystemFileEntry | FileSystemDirectoryEntry | null =
					item.webkitGetAsEntry();
				const entryContent: File[] = await readEntryContentAsync(entry);
				files.push(...entryContent);
				continue;
			}

			const file = item.getAsFile();
			if (file) {
				files.push(file);
			}
		}
	}

	return files;
}

// Returns a promise with all the files of the directory hierarchy
function readEntryContentAsync(
	entry: FileSystemFileEntry | FileSystemDirectoryEntry | null
): Promise<File[]> {
	return new Promise((resolve) => {
		let reading = 0;
		const contents: File[] = [];

		readEntry(entry);

		function readEntry(entry: FileSystemFileEntry | FileSystemDirectoryEntry | null) {
			if (isFile(entry)) {
				reading++;
				entry?.file((file) => {
					reading--;
					contents.push(file);

					if (reading === 0) {
						resolve(contents);
					}
				});
			} else if (isDirectory(entry)) {
				readReaderContent(entry?.createReader());
			}
		}

		function readReaderContent(reader: FileSystemDirectoryReader) {
			reading++;

			reader.readEntries(function (entries) {
				reading--;
				for (const entry of entries) {
					readEntry(entry);
				}

				if (reading === 0) {
					resolve(contents);
				}
			});
		}
	});
}

function isDirectory(entry: FileSystemEntry | null) {
	return entry?.isDirectory;
}
function isFile(entry: FileSystemEntry | null) {
	return entry?.isFile;
}
