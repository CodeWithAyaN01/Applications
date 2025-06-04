import os


# print(os.getcwd())
def get_all_files(base_path):
    files_info = {}
    for dirpath, dirnames, filenames in os.walk(base_path):
        for f in filenames:
            full_path = os.path.join(dirpath, f)
            # Get the relative path to preserve the folder structure
            rel_path = os.path.relpath(full_path, base_path)
            size = os.path.getsize(full_path)
            files_info[rel_path] = size
        # Ensure that all directories are listed as well for accurate comparisons
        for dir_name in dirnames:
            dir_path = os.path.join(dirpath, dir_name)
            rel_dir_path = os.path.relpath(dir_path, base_path)
            files_info[rel_dir_path] = None  # None for directories to differentiate from files
    return files_info

def compare_directories(dir1, dir2, output_file):
    files1 = get_all_files(dir1)
    files2 = get_all_files(dir2)

    all_files = set(files1.keys()).union(set(files2.keys()))

    with open(output_file, "w") as f:
        # Header
        f.write(f"{'File/Folder':<80} {'Status':<25} {'Details'}\n")
        f.write("=" * 120 + "\n")

        for file in sorted(all_files):
            size1 = files1.get(file)
            size2 = files2.get(file)

           

            if file not in files1:
                f.write(f"{file:<80} {'Only in LoanIQ2':<25} {'-'}\n")
            elif file not in files2:
                f.write(f"{file:<80} {'Only in LoanIQ1':<25} {'-'}\n")
            elif size1 != size2:
                if size1 is None or size2 is None:  # Handle directories
                    f.write(f"{file:<80} {'Directory mismatch':<25} {'-'}\n")
                else:
                    detail = f"Size Mismatch: {size1} bytes vs {size2} bytes"
                    f.write(f"{file:<80} {'Size mismatch':<25} {detail}\n")
            else:
                f.write(f"{file:<80} {'Match':<25} {'Size: {size1} bytes'}\n")

if __name__ == "__main__":
    dir1 = r"C:\Users\anike\OneDrive\Documents\pythonApps\LoanIQ1"
    dir2 = r"C:\Users\anike\OneDrive\Documents\pythonApps\LoanIQ2"
    output_path = r"D:\DirectoryComparison.txt"
    compare_directories(dir1, dir2, output_path)
    print(f"Comparison complete. Results saved to: {output_path}")
