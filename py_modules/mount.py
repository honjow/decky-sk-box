from config import logging
import subprocess


def get_mountpoint():
    mountpoint_list = []
    command = """
# 使用 lsblk 获取信息，排除指定条件的行，并输出结果
lsblk -rno PATH,MOUNTPOINT,FSTYPE,FSSIZE | while read -r path mountpoint fstype fssize; do
    # 检查是否有足够的字段
    if [ -n "$path" ] && [ -n "$mountpoint" ] && [ -n "$fstype" ] && [ -n "$fssize" ]; then
        # 检查挂载点路径是否不以 /frzr_root 开头
        if [[ "$mountpoint" != "/frzr_root"* ]]; then
            # 检查 fstype 是否为指定的几种之一
            case "$fstype" in
                ntfs|ext4|btrfs|exfat)
                    echo "$path $mountpoint $fstype $fssize"
                    ;;
            esac
        fi
    fi
done
"""
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            executable="/bin/bash",
        )

        stdout = result.stdout.strip()
        logging.info(f"get_mountpoint: {stdout}")
        # split to [path mountpoint fstype fssize]
        lines = stdout.split("\n")
        for line in lines:
            path, mountpoint, fstype, fssize = line.split(" ")
            if path and mountpoint and fstype and fssize:
                # dict
                mountpoint_list.append(
                    {
                        "path": path,
                        "mountpoint": mountpoint,
                        "fstype": fstype,
                        "fssize": fssize,
                    }
                )
        logging.info(f"get_mountpoint: {mountpoint_list}")
        return mountpoint_list
    except subprocess.CalledProcessError as e:
        logging.error(f"Error getting mountpoint: {e}, {e.stderr}")
        return []
