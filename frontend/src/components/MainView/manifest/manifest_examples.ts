export const SUBNET_TERRAFORM = `resource "aws_vpc" "vpc-prod" {
  cidr_block = "172.16.0.0/16"

  tags = {
    Name = "vpc-prod"
  }
}

resource "aws_subnet" "subnet-prod" {
  vpc_id            = aws_vpc.vpc-prod.id
  cidr_block        = "172.16.10.0/24"
  availability_zone = "us-west-2a"

  tags = {
    Name = "subnet-prod"
  }
}

resource "aws_network_interface" "nic-prod" {
  subnet_id   = aws_subnet.subnet-prod.id
  private_ips = ["172.16.10.100"]

  tags = {
    Name = "primary_network_interface"
  }
}

resource "aws_instance" "ec2-prod" {
  ami           = "ami-005e54dee72cc1d00" # us-west-2
  instance_type = "m6a.4xlarge"

  network_interface {
    network_interface_id = aws_network_interface.nic-prod.id
    device_index         = 0
  }

  credit_specification {
    cpu_credits = "unlimited"
  }
}
`