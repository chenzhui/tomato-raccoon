import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('111.229.139.144', port=22, username='ubuntu', password='g7#w9A|;:a]KX6', timeout=10)

cmd = 'docker exec -i aiguide-postgres psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname=\'shop_aichan\'"'
stdin, stdout, stderr = ssh.exec_command(cmd)
res = stdout.read().decode().strip()
if '1' not in res:
    cmd_create = 'docker exec -i aiguide-postgres psql -U postgres -c "CREATE DATABASE shop_aichan;"'
    stdin, stdout, stderr = ssh.exec_command(cmd_create)
    print("Created database:", stdout.read().decode())
else:
    print("Database shop_aichan already exists.")

ssh.close()
